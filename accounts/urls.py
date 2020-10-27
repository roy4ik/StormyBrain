from django.urls import path, include
from .views import *


urlpatterns = [
    path('login', LoginView.as_view(template_name='registration/login.html'), name ='login'),
    path('SignUp', SignUp.as_view(template_name = 'registration/signup.html'), name='SignUp'),
    path('logout', LogoutView.as_view(template_name='base/base.html'), name ='logout'),
    path('profile/<int:pk>/update', ProfileUpdate.as_view(), name='profileupdate'),
    path('profile/<int:pk>', ProfileDetail.as_view(), name='profileDetail'),
]
