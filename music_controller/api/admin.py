from django.contrib import admin
from .models import Room, UserAccount

# Register your models here.
admin.site.register(UserAccount)
admin.site.register(Room)