from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post
from .secrets import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI


def get_user_token_or_none(user):
    token_set = SpotifyToken.objects.filter(user_id=user.id)
    return token_set.first() if token_set.exists() else None


def create_or_update_tokens(user, access_token, refresh_token, token_type, scope, expires_in):
    existing_token = get_user_token_or_none(user)
    expires_at = timezone.now() + timedelta(seconds=expires_in)

    if existing_token:
        existing_token.access_token = access_token
        existing_token.refresh_token = refresh_token
        existing_token.token_type = token_type
        existing_token.scope = scope
        existing_token.expires_at = expires_at

        existing_token.save(update_fields=['access_token', 'refresh_token',
                                           'token_type', 'scope', 'expires_at'])

    else:
        token = SpotifyToken(user=user, access_token=access_token, refresh_token=refresh_token,
                             token_type=token_type, scope=scope, expires_at=expires_at)
        token.save()


def is_user_spotify_authenticated(user):
    token = get_user_token_or_none(user)

    if token:
        if token.expires_at > timezone.now():
            return True
        else:
            return refresh_spotify_token(user,token)

    return False


def refresh_spotify_token(user, old_token):
    refresh_token = old_token.refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': old_token.refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    if response.status_code == 400:
        return False 

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    scope = response.get('scope')
    expires_in = response.get('expires_in')

    create_or_update_tokens(
        user, access_token, refresh_token, token_type, scope, expires_in)
    return True
