from rest_framework import serializers
from chat.models import *


class RoomAllFields(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

    def update(self, instance, validated_data):
        submitted_chatters = validated_data.get('chatters')
        if submitted_chatters:
            for chatter in submitted_chatters:
                chatter_instance = Chatter.objects.get(id=chatter.id)
                instance.chatters.add(chatter_instance)
        instance.save()
        return instance


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
