"""music_controller URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path

from .views import RoomView, GetRoom, CreateRoom, JoinRoom, LeaveRoom, UpdateRoom

urlpatterns = [
    path('room', RoomView.as_view(), name='room'),
    path('get-room', GetRoom.as_view(), name='get-room'),
    path('join-room', JoinRoom.as_view(), name='join-room'),
    path('create-room', CreateRoom.as_view(), name='create-room'),
    path('leave-room', LeaveRoom.as_view(), name='leave-room'),
    path('update-room', UpdateRoom.as_view(), name='leave-room'),
]
