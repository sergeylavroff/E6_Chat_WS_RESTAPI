from rest_framework import serializers
from chat.models import *


class RoomAllFields(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class RoomSafeFields(serializers.ModelSerializer):
    password = serializers.SerializerMethodField()

    def get_password(self, obj):
        if obj.password:
            return True
        else:
            return False

    class Meta:
        model = Room
        fields = '__all__'



class MessageAllSerializer(serializers.ModelSerializer):
    # author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Message
        fields = '__all__'


class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatter
        fields = ('user', 'name', 'about', 'pic')
