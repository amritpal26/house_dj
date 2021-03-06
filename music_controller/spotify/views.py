from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from requests import Request, post
from .secrets import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from .util import *
from .models import Vote
from api.models import Room

class AuthURL(APIView):
    def get(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)
            
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
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        is_authenticated = is_user_spotify_authenticated(request.user)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class CurrentlyPlaying(APIView):
    def get(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        user = request.user
        room = user.all_rooms.first()
        if not room:
            return Response('Join a room first', status=status.HTTP_404_NOT_FOUND)
        
        response = execute_spotify_request(room.host, 'player/currently-playing')
        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')
        artist_string = ', '.join([artist.get('name') for artist in item.get('artists')])

        votes = len(Vote.objects.filter(room_id=room.id, song_id=song_id))
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }


        self.update_room_song(room, song_id)
        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        if room.current_song_id != song_id:
            room.current_song_id = song_id
            room.save(update_fields=['current_song_id'])
            votes = Vote.objects.filter(room=room).delete()

class PlaySong(APIView):
    def put(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)
        
        room_code = request.data.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        if not room:
            return Response('Room not found', status=status.HTTP_404_NOT_FOUND)

        user = request.user
        is_request_from_host = user.hosted_room and user.hosted_room.id == room.id
        if is_request_from_host or room.guest_can_pause:
            play_song(room.host)
            return Response('Success', status=status.HTTP_200_OK)

        return Response('Only host can play', status=status.HTTP_403_FORBIDDEN)

class PauseSong(APIView):
    def put(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)
        
        room_code = request.data.get('room_code')
        room = Room.objects.filter(code=room_code).first()  
        if not room:
            return Response('Room not found', status=status.HTTP_404_NOT_FOUND)

        user = request.user
        is_request_from_host = user.hosted_room and user.hosted_room.id == room.id
        if is_request_from_host or room.guest_can_pause:
            pause_song(room.host)
            return Response('Success', status=status.HTTP_200_OK)
        
        return Response('Only host can pause', status=status.HTTP_403_FORBIDDEN)

class SkipSong(APIView):
    def post(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)
        
        room_code = request.data.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        if not room:
            return Response('Room not found', status=status.HTTP_404_NOT_FOUND) 

        user = request.user
        votes = Vote.objects.filter(room=room)
        user_already_voted = votes.filter(user=user).exists()
        if user_already_voted:
            return Response('Already voted', status=status.HTTP_403_FORBIDDEN)

        is_request_from_host = user.hosted_room and user.hosted_room.id == room.id
        if is_request_from_host or len(votes)+1 > room.votes_to_skip:
            skip_song(user)
            votes.delete()
        else:
            vote = Vote(user=user, room=room, song_id=room.current_song_id)
            vote.save()

        return Response('Success', status=status.HTTP_200_OK)