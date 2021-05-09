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

class UserRoomsSerializer(serializers.ModelSerializer):
    def _is_host(self, obj):
        user_id = self.context.get('user_id')
        return user_id and obj.host.id == user_id

    is_host = serializers.SerializerMethodField('_is_host')
    class Meta:
        model = Room
        fields = ['id', 'code', 'is_host', 'title', 'guest_can_pause',
                  'votes_to_skip', 'created_at']