from django.db import models
from random import choices
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import string

def generate_code(length=8):
    while True:
        try_code = ''.join(choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=try_code).count() == 0:
            return try_code


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            return ValueError('Users must have a valid email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)

        user.set_password(password)
        user.save()

        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.CharField(max_length=255, unique=True, null=False)
    first_name = models.CharField(max_length=255, default="", null=False)
    last_name = models.CharField(max_length=255, default="", null=False)
    session_key = models.CharField(max_length=255, default='', null=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    @property
    def rooms(self):
        return Room.objects.filter(host=self)

    @property 
    def get_full_name(self):
        if self.first_name and self.last_name:
            return self.first_name + ' ' + self.last_name
        elif self.first_name:
            return self.first_name
        else:
            return self.last_name

    def __unicode__(self):
            return self.name


class Room(models.Model):
    code = models.CharField(max_length=20, default=generate_code, unique=True)
    host = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)