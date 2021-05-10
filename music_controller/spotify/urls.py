from django.urls import path
from .views import AuthURL, IsAuthenticated, AuthenticateSpotify

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('authenticate', AuthenticateSpotify.as_view()),
    path('is-authenticated', IsAuthenticated.as_view()),
]
