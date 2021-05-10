from rest_framework import serializers

class YourSerializer(serializers.Serializer):
   code = serializers.IntegerField()
   error = serializers.IntegerField()