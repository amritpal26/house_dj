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
        """
        Creates and saves a user with the given email and password.
        """
        if not email:
            return ValueError('Users must have a valid email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)

        user.is_superuser = False
        user.is_staff = False

        user.set_password(password)
        user.save()

        return user
    
    def create_superuser(self, email, password, first_name, last_name):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.CharField(max_length=255, unique=True, null=False)
    first_name = models.CharField(max_length=255, default="", null=False)
    last_name = models.CharField(max_length=255, default="", null=False)

    is_staff = models.BooleanField(default=False)           # a admin user; non super-user
    is_superuser = models.BooleanField(default=False)       # a superuser
    is_active = models.BooleanField(default=True)          # instead of deleting user, mark as false.

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    @property
    def member_rooms(self):
        return u.members.all()

    @property
    def hosted_rooms(self):
        return self.room_set.all()

    @property
    def rooms(self):
        return self.member_rooms() | self.hosted_rooms()

    @property 
    def full_name(self):
        if self.first_name and self.last_name:
            return self.first_name + ' ' + self.last_name
        elif self.first_name:
            return self.first_name
        else:
            return self.last_name

    def __unicode__(self):
            return self.email

class Room(models.Model):
    code = models.CharField(max_length=20, default=generate_code, unique=True)
    title = models.CharField(max_length=256, default="", null=False)
    host = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(UserAccount, blank=True, related_name="members")

    @classmethod
    def join(cls, user, join_room):
        join_room.members.add(user)

    @classmethod
    def leave(cls, user, leave_room):
        leave_room.members.remove(user)