from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import RoomSerializer, CreateRoomSerializer
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
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                room = room[0]
                data = RoomSerializer(room).data
                data['is_host'] = request.user.id == room.host.id

                return Response(data, status=status.HTTP_200_OK)
            return Response('Invalid Room Code', status=status.HTTP_404_NOT_FOUND)
        
        return Response('Code paramater not found in request', status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    pass


class CreateRoomView(APIView):
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