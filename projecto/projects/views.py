from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ProjectLeadCreateSerializer, ProjectLeadSerializer, ProjectDisplaySerializer
from .models import ProjectLead
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
User = get_user_model()

class ProjectLeadView(viewsets.ModelViewSet):
    serializer_class = ProjectLeadCreateSerializer
    queryset = ProjectLead.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = ProjectLeadCreateSerializer(data=data)

        if not serializer.is_valid():
            return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
        
        project = serializer.create(serializer.validated_data)
        project = ProjectLeadSerializer(project)

        return Response(project.data,status.HTTP_201_CREATED)

class ProjectsDisplayView(viewsets.ModelViewSet):
    serializer_class = ProjectDisplaySerializer
    queryset = ProjectLead.objects.all()

    def get_queryset(self):
        queryset = ProjectLead.objects.all()
        email = self.request.query_params.get("email")
        frontend = self.request.query_params.get("frontend")
        backend = self.request.query_params.get("backend")
        
        if email:
            try:
                user = User.objects.get(email=email)
                queryset = queryset.exclude(owner=user)
            except:
                pass

        if(frontend=="true"):
            queryset = queryset.filter(frontend=True)
        if(backend=="true"):
            queryset = queryset.filter(backend=True)

        return queryset