from django.urls import path, include
import django.contrib.auth.urls
from .views import *


urlpatterns = [
    path('', include('django.contrib.auth.urls')),
    path('login', LoginView.as_view(template_name='registration/login.html'), name ='login'),
    path('signUp', SignUp.as_view(template_name = 'registration/signup.html'), name='SignUp'),
    path('logout', LogoutView.as_view(template_name='base/base.html'), name ='logout'),
    path('profile/<int:pk>/update', ProfileUpdate.as_view(), name='profileupdate'),
    path('profile/<int:pk>', ProfileDetail.as_view(), name='profileDetail'),
]
