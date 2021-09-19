from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room'),

    path('room/create/', views.CreateRoomAPIView.as_view()),
    path('room/all/', views.RoomListAPIView.as_view()),
    path('room/view/<int:pk>/', views.RoomOneAPIView.as_view()),
    path('room/manage/<int:pk>/', views.RoomManageAPIView.as_view()),
    path('message/create/', views.MessageCreateAPIView.as_view()),
    path('room/messages/<int:pk>/', views.MessageInRoomAPIView.as_view()),
    path('profile/view/<int:pk>/', views.ProfileAPIView.as_view()),
    path('profile/create/', views.ProfileCreateView.as_view()),
    path('message/get/<int:pk>/', views.MessageOneAPIView.as_view()),

    path('profile/update/', views.ProfileUpdateView.as_view()),
]
