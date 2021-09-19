from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()


class Chatter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="Profile")
    name = models.CharField(max_length=255, blank=True)
    about = models.CharField(max_length=1023, blank=True)
    pic = models.ImageField(blank=True, upload_to='media/')

    def __str__(self):
        return self.name

class Room(models.Model):
    name = models.CharField(max_length=255,
                            unique=True)
    password = models.CharField(max_length=255, null=True, blank=True)
    chatters = models.ManyToManyField(User)

    def __str__(self):
        return self.name

class Message(models.Model):
    message = models.TextField(blank=True, max_length=1024)
    created = models.DateTimeField(auto_now_add=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)