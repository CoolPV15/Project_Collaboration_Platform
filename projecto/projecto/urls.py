"""
URL configuration for projecto project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views
from accounts import views as user_views
from projects import views as project_views
'''
Auther: Pranav Singh
'''

'''
A router for generating the URL patterns for the Registration viewsets
'''
router = routers.DefaultRouter()
router.register(r'accounts',user_views.RegistrationView,'accounts')
router.register(r'projectleads',project_views.ProjectLeadView,'projectleads')
router.register(r'projects',project_views.ProjectsDisplayView,"projects")
router.register(r'projectrequests',project_views.ProjectRequestView,"projectrequest")
router.register(r'projectrequestsdisplay',project_views.ProjectRequestDisplayView,"projectrequestdisplay")
router.register(r'projectmembers',project_views.ProjectMembersView,"projectmembersview")
router.register(r'projectreject',project_views.ProjectRejectedView,"projectrejectedview")
'''
urlpatterns that include endpoints for the jwt token authentication, and paths from other apps
'''
urlpatterns = [
    path('api/token/',jwt_views.TokenObtainPairView.as_view()),
    path('api/token/refresh/',jwt_views.TokenRefreshView.as_view()),
    path('api/token/verify/',jwt_views.TokenVerifyView.as_view()),
    path('api/accounts/',include('accounts.urls')),
    path('admin/', admin.site.urls),
    path('api/',include(router.urls)),
]
