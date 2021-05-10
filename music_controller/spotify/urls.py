from django.urls import path
from .views import AuthURL, spotify_redirect, IsAuthenticated

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_redirect),
    path('is-authenticated', IsAuthenticated.as_view()),
]
