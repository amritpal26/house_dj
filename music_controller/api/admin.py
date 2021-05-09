from django.contrib import admin
from .models import Room, UserAccount

class RoomAdmin(admin.ModelAdmin):
    model = Room
    filter_horizontal = ('members',)

# Register your models here.
admin.site.register(UserAccount)
admin.site.register(Room, RoomAdmin)