from rest_framework import serializers
from .models import Room, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'session_key']


class RoomSerializer(serializers.ModelSerializer):
    host = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'code', 'host', 'guest_can_pause',
                  'votes_to_skip', 'created_at']


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['guest_can_pause', 'votes_to_skip']