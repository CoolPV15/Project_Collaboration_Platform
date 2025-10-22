from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from .manager import UserManager
'''
Auther: Pranav Singh
'''

'''
Defining a Users model using the AbstractBaseUser class with all the necessary information of the user,
along with some additional fields for handling user permissions
'''
class Users(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    frontend = models.BooleanField(default=False)
    backend = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["firstname","lastname"]

    objects = UserManager()

    def __str__(self):
        return self.email