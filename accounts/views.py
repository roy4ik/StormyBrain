from django.contrib.auth.models import Group
from django.shortcuts import render, redirect
from django import views
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse, reverse_lazy
from django.contrib.auth import authenticate, login
from django.views.generic import CreateView, UpdateView, DetailView, DeleteView
from .models import Profile, User
from .forms import UserProfileForm, SignupForm, AuthenticationForm
class home(LoginView):
    model = Profile
    template_name = 'home.html'
    success_url = 'stormy:stormies'

    def form_invalid(self, form):
        """If the form is invalid, render the invalid form."""
        return render(self.request, 'partials/login_container.html', {'login_form':form, 'signup_form': SignupForm()})

class SignUp(CreateView):
    model = User
    form_class = SignupForm
    template_name = 'registration/signUp.html'
    success_url = 'stormy:stormies'
    failed_message = "Couldn't sign you up, try again!"

    def form_valid(self,form):
        super().form_valid(form)
        user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
        if user:
            login(self.request,user)
        return redirect(reverse(self.get_success_url()))
    
    def form_invalid(self, form):
        """If the form is invalid, render the invalid form."""
        return render(self.request, 'partials/login_container.html', {'signup_form':form, 'login_form': AuthenticationForm()})



class ProfileUpdate(UpdateView):
    model = Profile
    form_class = UserProfileForm
    template_name = 'forms/profile-form.html'
    success_url = 'profileDetail'
    failed_message = "The profile couldn't be updated"


class ProfileDetail(DetailView):
    model = Profile
    template_name = 'partials/profile.html'