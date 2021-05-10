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


class AuthenticateSpotify(APIView):
    def post(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)


        if 'code' not in request.data:
            return Response('Invalid data: Missing "code"', status=status.HTTP_400_BAD_REQUEST)

        code = request.data.get('code')

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

        if error:
            return Response('Error Authenticating', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        create_or_update_tokens(request.user,
                                access_token, refresh_token, token_type, scope, expires_in)
        return Response({'is_authenticated': True}, status=status.HTTP_200_OK)


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_user_spotify_authenticated(request.user)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
