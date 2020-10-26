from django.contrib.auth.models import Group
from django.shortcuts import render, redirect
from django import views
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse, reverse_lazy
from django.contrib.auth import authenticate, login
from django.views.generic import CreateView, UpdateView, DetailView, DeleteView
from .models import Profile, User
from .forms import UserProfileForm, SignupForm
class home(LoginView):
    template_name = 'home.html'
    model = Profile

class SignUp(CreateView):
    model = User
    form_class = SignupForm
    template_name = 'registration/signUp.html'
    success_url = 'home'
    failed_message = "The user couldn't be created"

    def form_valid(self,form):
        super().form_valid(form)
        user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
        if user:
            login(self.request,user)
        return redirect(reverse(self.get_success_url()))


class ProfileUpdate(UpdateView):
    model = Profile
    form_class = UserProfileForm
    template_name = 'forms/profile-form.html'
    success_url = 'profileDetail'
    failed_message = "The profile couldn't be updated"


class ProfileDetail(DetailView):
    model = Profile
    template_name = 'partials/profile.html'