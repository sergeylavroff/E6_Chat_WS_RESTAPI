from django.contrib import admin
from chat.models import Chatter, Room, Message

admin.site.register(Chatter)
admin.site.register(Room)
admin.site.register(Message)


# Register your models here.
