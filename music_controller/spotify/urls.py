from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('authenticate', AuthenticateSpotify.as_view()),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('currently-playing', CurrentlyPlaying.as_view()),
    path('play', PlaySong.as_view()),
    path('pause', PauseSong.as_view()),
    path('skip', SkipSong.as_view()),
]
