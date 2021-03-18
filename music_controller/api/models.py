from django.db import models
from random import choice
import string

def generate_code(length=8):
    while True:
        try_code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=try_code).count() == 0:
            return try_code

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=100, default="", null=False)

    @property
    def rooms(self):
        return Room.objects.filter(host=self)

    def __unicode__(self):
            return self.name


class Room(models.Model):
    code = models.CharField(max_length=10, default="", unique=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)