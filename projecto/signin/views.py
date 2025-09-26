from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from rest_framework import viewsets,status
from .serializers import UsersCreateSerializer,UsersSerializer
from .models import Users
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
User = get_user_model()

'''
Auther: Pranav Singh
'''


'''
A Home View that acts as an api endpoint to retrieve the information for the logged in users,
only if the authorisation token is valid
'''
class HomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user
        
        return Response({
            "firstname":user.firstname,
            "lastname":user.lastname,
            "email":user.email,
            "frontend":user.frontend,
            "backend":user.backend,
        })
    
'''
A Registration View that uses the UsersCreateSerializer to validate the user's details and
send a HTTP 200 Response if all the credentials are in correct format, otherwise it returns a
HTTP 400 Response
'''    
class RegistrationView(viewsets.ModelViewSet):
    serializer_class = UsersCreateSerializer
    queryset = Users.objects.all()

    def create(self,request,*args,**kwargs):
        data = request.data

        serializer = UsersCreateSerializer(data=data)

        if not serializer.is_valid():
            return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
        
        user = serializer.create(serializer.validated_data)
        user = UsersSerializer(user)

        return Response(user.data, status = status.HTTP_201_CREATED)
    
'''
A Logout View that logs the users out by blacklisting the current access token
'''
class LogOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return Response({"Error: Refresh Token Required"})
        
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"Success":"Logged Out"}, status = status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"Error":str(e)}, status = status.HTTP_400_BAD_REQUEST)
    
class RetrieveUserView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self,request):
        user = request.data
        user = UsersSerializer(user)

        return Response(user.data, status = status.HTTP_200_OK)
    