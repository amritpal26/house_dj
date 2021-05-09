from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer, UserRoomsSerializer
from .models import Room, UserAccount

# Views.
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class GetRoom(APIView):
    serializer_class = RoomSerializer
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
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            
            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response('Invalid Room Code', status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user = request.user

            if user.hosted_rooms.filter(code=code).exists():
                return Response('You cannot join the room you host', status=status.HTTP_409_CONFLICT)

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
            # extract data
            host = request.user
            
            title = serializer.data['title']
            votes_to_skip = serializer.data['votes_to_skip']
            guest_can_pause = serializer.data['guest_can_pause']  

            # Create and save room in db.
            room = Room(title=title, host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
            room.save()
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                room = queryset[0]
                user = request.user

                if not user.rooms.filter(code=code).exists():
                    return Response('You are not hosting or a member of this group', status=status.HTTP_409_CONFLICT)

                if user.hosted_rooms:
                    # Need to decide what to do in this case.
                    # Options:
                    #   1. Send notification to other users and remove them as well.
                    #   2. Delete the room as well OR keep the room under the host.
                    pass

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
            if not user.hosted_rooms.filter(code=room.code).exists():
                return Response('You are not the host of this room', status=status.HTTP_403_FORBIDDEN)

            room.title = title
            room.votes_to_skip = votes_to_skip
            room.guest_can_pause = guest_can_pause
            room.save(update_fields=['title', 'votes_to_skip', 'guest_can_pause'])

            return Response(self.serializer_class(room).data, status=status.HTTP_200_OK)

        return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)

class GetUserRooms(APIView):
    serializer_class = UserRoomsSerializer

    def get(self, request, format=None):
        if not request.user or not request.user.is_authenticated:
            return Response('Unauthorized', status=status.HTTP_401_UNAUTHORIZED)

        rooms_set = request.user.rooms
        data = self.serializer_class(rooms_set, 
            many=True, 
            context={'user_id': request.user.id}
        ).data

        return Response(data, status=status.HTTP_200_OK)