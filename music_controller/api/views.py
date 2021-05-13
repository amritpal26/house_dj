from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import *
from .models import Room, UserAccount

# Views.
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class GetRoom(APIView):
    serializer_class = GetRoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        code = request.GET.get(self.lookup_url_kwarg)
        if code:
            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response('Invalid Room Code', status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            data = self.serializer_class(room, context={'user_id': request.user.id}).data

            return Response(data, status=status.HTTP_200_OK)
        
        return Response('Code paramater not found in request', status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    serializer_class = GetRoomSerializer
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            user = request.user
            
            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response('Invalid Room Code', status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            if user.hosted_room and user.hosted_room.code == code:
                return Response('You cannot join the room you host', status=status.HTTP_409_CONFLICT)
            if user.all_rooms.exists():
                return Response('Leave the current room to create a new room', status=status.HTTP_403_FORBIDDEN)

            Room.join(user, room)
            return Response(self.serializer_class(room).data, status=status.HTTP_200_OK)
        
        return Response('Invalid data, code not found', status=status.HTTP_400_BAD_REQUEST) 

class CreateRoom(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = request.user

            if user.all_rooms.exists():
                return Response('Leave the current room to create a new room', status=status.HTTP_403_FORBIDDEN)
            
            title = serializer.data['title']
            votes_to_skip = serializer.data['votes_to_skip']
            guest_can_pause = serializer.data['guest_can_pause']  

            room = Room(title=title, host=user, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
            room.save()
            return Response(GetRoomSerializer(room).data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        code = request.data.get('code')
        if code != None:
            queryset = Room.objects.filter(code=code)
            if queryset.exists:
                room = queryset.first()
                user = request.user

                if not user.all_rooms.filter(code=code).exists():
                    return Response('You are not hosting or a member of this group', status=status.HTTP_409_CONFLICT)

                if user.hosted_room and user.hosted_room.id == room.id:
                    room.delete()
                else:
                    Room.leave(user, room)

                return Response('Room Left!', status=status.HTTP_200_OK)
            return Response('Invalid Room Code', status=status.HTTP_404_NOT_FOUND)
        
        return Response('Invalid data, code not found', status=status.HTTP_400_BAD_REQUEST) 

class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer
    
    def post(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            title = serializer.data['title']
            votes_to_skip = serializer.data['votes_to_skip']
            guest_can_pause = serializer.data['guest_can_pause']
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response('Room not found', status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user = request.user
            if not user.hosted_room:
                return Response('You are not the host of this room', status=status.HTTP_403_FORBIDDEN)

            room.title = title
            room.votes_to_skip = votes_to_skip
            room.guest_can_pause = guest_can_pause
            room.save(update_fields=['title', 'votes_to_skip', 'guest_can_pause'])

            return Response(GetRoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)

class GetUserRooms(APIView):
    serializer_class = UserRoomsSerializer

    def get(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        rooms_set = request.user.all_rooms
        data = self.serializer_class(rooms_set, 
            many=True, 
            context={'user_id': request.user.id}
        ).data

        return Response(data, status=status.HTTP_200_OK)