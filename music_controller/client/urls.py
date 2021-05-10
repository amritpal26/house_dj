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
from .views import index

app_name = 'client'

urlpatterns = [
    path('', index, name='index'),
    
    # Auth
    path('login', index, name='index'),
    path('signup', index, name='index'),
    path('reset-password', index, name='index'),
    path('password/reset/confirm/<str:uid>/<str:token>', index, name='index'),
    path('activate/<str:uid>/<str:token>', index, name='index'),

    # Rooms
    path('create-room', index, name='index'),
    path('join-room', index, name='index'),
    path('room/<str:roomCode>', index, name='index'),
    path('edit-room/<str:roomCode>', index, name='index'),

    # social login auth redirect
    path('google', index, name='index'),
    path('facebook', index, name='index'),
    path('spotify', index, name='index'),
]
