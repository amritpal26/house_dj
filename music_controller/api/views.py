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

class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # TODO: fix after setting Auth. Video-5
            host = UserAccount.objects.first()
            host_session_key = request.session.session_key
            host.session_key = host_session_key

            # extract data
            votes_to_skip = serializer.data['votes_to_skip']
            guest_can_pause = serializer.data['guest_can_pause']  

            # Create and save room in db.
            room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
            room.save()

            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)