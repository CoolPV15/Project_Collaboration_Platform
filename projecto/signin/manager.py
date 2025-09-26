from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext as _
'''
Author Name: Pranav Singh
'''

'''
A Manager class that uses the BaseUserManager class to create a custom admin for handling the users
'''
class UserManager(BaseUserManager):
    #Overiding the create_user funtion for creating the user
    def create_user(self,email,password, **extra_fields):
        if not email:
            raise ValueError(_("Users must have an email address"))
        
        #Normalizing the email so that it remains consistent in the database
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self,email,password, **extra_fields):
        #Providing the admin with all the necessary permissions to handle the users
        extra_fields.setdefault("is_superuser",True)
        extra_fields.setdefault("is_staff",True)
        extra_fields.setdefault("is_active",True)

        if(extra_fields.get("is_staff")) is not True:
            raise ValueError (_('Superuser must have is_staff=True'))
        if(extra_fields.get('is_superuser')) is not True:
            raise ValueError(_('Superuser must have is_superuser=True'))
        return self.create_user(email,password, **extra_fields)