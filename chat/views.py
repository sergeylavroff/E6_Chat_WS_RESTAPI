import json

from django.shortcuts import render
from django.utils.safestring import mark_safe
from chat.serializers import RoomAllFields, MessageAllSerializer, UserShortSerializer, RoomSafeFields
from rest_framework import generics
from chat.models import Room, Message
from chat.permissions import IsOwner
from django.contrib.auth.decorators import login_required
from django.views.generic import ListView, UpdateView, CreateView, DetailView, DeleteView
from chat.models import Chatter
from chat.forms import ProfileUserForm, ProfileChatterForm
from django.contrib.auth.models import User

@login_required
def index(request):
    """Главная страница"""
    return render(request, 'index.html')

@login_required
def profile(request):
    return render(request, 'profile.html')


def room(request, room_name):
    return render(request, 'room.html', {
        'room_name_json': mark_safe(json.dumps(room_name))
    })

class CreateRoomAPIView(generics.CreateAPIView):
    serializer_class = RoomAllFields

class RoomListAPIView(generics.ListAPIView):
    serializer_class = RoomSafeFields
    queryset = Room.objects.all()

class RoomOneAPIView(generics.RetrieveAPIView):
    serializer_class = RoomSafeFields
    def get_object(self):
        id = self.kwargs.get('pk')
        return Room.objects.get(id=id)

class RoomManageAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RoomAllFields
    queryset = Room.objects.all()

class MessageCreateAPIView(generics.CreateAPIView):
    serializer_class = MessageAllSerializer

class MessageManageAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MessageAllSerializer
    permission_classes = (IsOwner, )
    def get_object(self, **kwargs):
        id = Message.objects.get(self.request.query_params.get("id"))
        return id

class MessageInRoomAPIView(generics.ListAPIView):
    serializer_class = MessageAllSerializer
    def get_queryset(self):
        room = self.kwargs.get('pk')
        queryset = Message.objects.all().filter(room=room).order_by('created')
        return queryset

class MessageOneAPIView(generics.RetrieveAPIView):
    serializer_class = MessageAllSerializer
    def get_object(self):
        id = self.kwargs.get('pk')
        return Message.objects.get(id=id)

class ProfileCreateView(generics.CreateAPIView):
    serializer_class = UserShortSerializer

class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = UserShortSerializer
    def get_object(self, **kwargs):
        user = Chatter.objects.get(user=self.request.user)
        return user

class ProfileAPIView(generics.RetrieveAPIView):
    serializer_class = UserShortSerializer
    def get_object(self):
        user = self.kwargs.get('pk')
        user = Chatter.objects.get(user=user)
        return user
