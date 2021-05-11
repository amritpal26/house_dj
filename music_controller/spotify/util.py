from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
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
            return refresh_spotify_token(user,token) != None

    return False


def refresh_spotify_token(user, old_token):
    refresh_token = old_token.refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': old_token.refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    scope = response.get('scope')
    expires_in = response.get('expires_in')

    create_or_update_tokens(
        user, access_token, refresh_token, token_type, scope, expires_in)
    return access_token

def is_token_expired(token):
    return token.expires_at < (timezone.now() + timedelta(seconds=1))

def execute_spotify_request(user, endpoint, post_=False, put_=False):
    token = get_user_token_or_none(user)
    if not token:
        return {'Error': 'User not a host'}
    
    if is_token_expired(token):
        refresh_spotify_token(user, token)
    
    headers = {'Content-Type': 'application/json',
               'Authorization': '{0} {1}'.format(token.token_type, token.access_token)}

    base_url = "https://api.spotify.com/v1/me/"
    if post_:
        post(base_url + endpoint, headers=headers)
    if put_:
        put(base_url + endpoint, headers=headers)

    response = get(base_url + endpoint, {}, headers=headers)
    print('original res: ', response)
    try:
        return response.json()
    except:
        return {'Error': 'Request failed'}


def play_song(user):
    return execute_spotify_request(user, "player/play", put_=True)


def pause_song(user):
    return execute_spotify_request(user, "player/pause", put_=True)


def skip_song(user):
    return execute_spotify_request(user, "player/next", post_=True)