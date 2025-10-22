from rest_framework import serializers
from .models import Users
from django.contrib.auth import get_user_model,authenticate
User = get_user_model()
'''
Auther: Pranav Singh
'''

'''
Defining UsersCreateSerializer for handling the user details received from the frontend and then calling the
create_user function to create a new user with the details received
'''
class UsersCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ("firstname","lastname","email","password","frontend","backend")

    def create(self,validated_data):
        user = User.objects.create_user(
            firstname = validated_data["firstname"],
            lastname = validated_data["lastname"],
            email = validated_data["email"],
            password = validated_data["password"],
            frontend = validated_data["frontend"],
            backend = validated_data["backend"]
        )

        return user

'''
Definining UsersSerializer that uses ModelSerializer class for displaying details of the user 
'''   
class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ["firstname","lastname","email","frontend","backend"]
