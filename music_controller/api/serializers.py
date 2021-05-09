from rest_framework import serializers
from .models import Room, UserAccount
from djoser.serializers import UserCreateSerializer

#-----------------------------------------------------
#------------------ User Authentication --------------
class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = UserAccount
        fields = ['id', 'email', 'first_name', 'last_name', 'password']

#-----------------------------------------------------

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ['id', 'email', 'first_name', 'last_name']


class RoomSerializer(serializers.ModelSerializer):
    host = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'code', 'title', 'host', 'guest_can_pause',
                  'votes_to_skip', 'created_at']


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['title', 'guest_can_pause', 'votes_to_skip']

class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ('title', 'guest_can_pause', 'votes_to_skip', 'code')