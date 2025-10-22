from rest_framework import serializers
from .models import ProjectLead
from django.contrib.auth import get_user_model
User = get_user_model()

class ProjectLeadCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    class Meta:
        model = ProjectLead
        fields = ["email","projectname","description","frontend","backend"]

    def create(self, validated_data):
        email = validated_data.pop("email")
        try:
            user = User.objects.get(email=email)
        except:
            raise serializers.ValidationError({"email":"User with this email does not exist"})
        validated_data["owner"] = user
        project = ProjectLead.objects.create(
            owner = validated_data["owner"],
            projectname = validated_data["projectname"],
            description = validated_data["description"],
            frontend = validated_data["frontend"],
            backend = validated_data["backend"])
            
        return project
        
class ProjectLeadSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)
    class Meta:
        model = ProjectLead
        fields = ["email","projectname","description","frontend","backend"]
    
class ProjectDisplaySerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source = 'owner.email', read_only=True)  
    fname = serializers.CharField(source = "owner.firstname", read_only=True)
    lname = serializers.CharField(source = "owner.lastname", read_only=True)
    class Meta:
        model = ProjectLead
        fields = ["owner_email","fname","lname","projectname","description","frontend","backend"]