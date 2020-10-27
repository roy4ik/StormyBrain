from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User
from .models import *

class SignupForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super(SignupForm, self).__init__(*args, **kwargs)
        self.fields['password1'].widget = forms.PasswordInput(attrs={'placeholder': 'Password'})
        self.fields['password2'].widget = forms.PasswordInput(attrs={'placeholder': 'Password confirmation'})

    class Meta:
        model = User
        fields = ['first_name','last_name', 'email','username', 'password1', 'password2']
        widgets= {
            'first_name': forms.TextInput(attrs={'placeholder': 'First Name'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'Last Name'}),
            'email': forms.EmailInput(attrs={'placeholder': 'Email'}),
            'username': forms.TextInput(attrs={'placeholder': 'Username'}),
        }
    

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        exclude = ['user']
