from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User
from .models import *

class SignupForm(UserCreationForm):
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    class Meta:
        model = User
        fields = ['first_name','last_name', 'username', 'password1', 'password2']

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        exclude = ['user']
