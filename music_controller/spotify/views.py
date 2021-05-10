from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from requests import Request, post
from .secrets import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from .util import *


class AuthURL(APIView):

    def get(self, request, format=None):
        scopes = ' '.join([
            'user-read-playback-state',
            'user-read-currently-playing',
            'user-modify-playback-state'
        ])

        auth_url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'auth_url': auth_url}, status=status.HTTP_200_OK)


def spotify_redirect(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    refresh_token = response.get('refresh_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    scope = response.get('scope')
    error = response.get('error')

    create_or_update_tokens(request.user,
                            access_token, refresh_token, token_type, scope, expires_in)

    return redirect('client:index')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_user_spotify_authenticated(user)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
