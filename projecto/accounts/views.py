"""
views.py

This module defines API views related to user authentication, registration,
logout handling, and profile retrieval. It uses Django REST Framework
(APIs, serializers, permissions) along with JWT-based authentication via
SimpleJWT.

Author: Pranav Singh
"""

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UsersCreateSerializer, UsersSerializer
from .models import Users
from django.contrib.auth import get_user_model

User = get_user_model()

class HomeView(APIView):
    """
    Retrieve logged-in user details.

    This view serves as an authenticated endpoint that returns the current
    user's profile information. The request must contain a valid JWT access
    token; otherwise, access will be denied.

    Permissions:
        IsAuthenticated – Ensures the user is logged in.

    Methods:
        get(request):
            Returns user profile data such as name, email, and skill roles.

            Args:
                request (Request): Incoming HTTP GET request.

            Returns:
                Response: JSON containing authenticated user info.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handle GET request and return the current authenticated user's details.
        """
        user = request.user
        return Response({
            "firstname": user.firstname,
            "lastname": user.lastname,
            "email": user.email,
            "frontend": user.frontend,
            "backend": user.backend,
        })


class RegistrationView(viewsets.ModelViewSet):
    """
    Handle user registration.

    This view allows new users to register an account. It uses
    `UsersCreateSerializer` to validate and create a new user record.
    If validation succeeds, the user is stored in the database and a
    success response is returned.

    Meta:
        serializer_class (UsersCreateSerializer):
            Used for validating incoming registration data.
        queryset:
            All existing user records.

    Methods:
        create(request):
            Validates incoming data and creates a new user if valid.

            Args:
                request (Request): Incoming POST request.

            Returns:
                Response: Newly created user data or validation errors.
    """

    serializer_class = UsersCreateSerializer
    queryset = Users.objects.all()

    def create(self, request, *args, **kwargs):
        """
        Validate incoming data and create a new user.

        Args:
            request (Request): Registration data from client.

        Returns:
            Response: HTTP 201 with user data on success,
                      HTTP 400 with errors on failure.
        """
        data = request.data
        serializer = UsersCreateSerializer(data=data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.create(serializer.validated_data)
        user = UsersSerializer(user)

        return Response(user.data, status=status.HTTP_201_CREATED)


class LogOutView(APIView):
    """
    Logout endpoint using JWT token blacklisting.

    This view invalidates a user's refresh token, effectively logging them out.
    The request must provide a valid refresh token; the token is then added
    to the blacklist so it can no longer be used.

    Permissions:
        IsAuthenticated – Only logged-in users can log out.

    Methods:
        post(request):
            Blacklists the provided refresh token.

            Args:
                request (Request): Contains `refresh_token`.

            Returns:
                Response: Success or error message.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Blacklist the supplied refresh token to log the user out.

        Args:
            request (Request): Includes 'refresh_token' field.

        Returns:
            Response: Confirmation message or error.
        """
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return Response({"Error": "Refresh Token Required"})

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"Success": "Logged Out"}, status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RetrieveUserView(APIView):
    """
    Retrieve user profile data for authenticated users.

    NOTE:
        This view pulls user data from request.data,
        which may not be the intended behavior — typically, user data is
        accessed via `request.user`. Adjust if needed.

    Permissions:
        IsAuthenticated – Only authenticated users may access this.

    Methods:
        get(request):
            Returns serialized user data.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return serialized user data for the authenticated user.

        Args:
            request (Request): Incoming GET request.

        Returns:
            Response: User profile in serialized form.
        """
        user = request.data  # Typically should be request.user
        user = UsersSerializer(user)
        return Response(user.data, status=status.HTTP_200_OK)