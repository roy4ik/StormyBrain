from django.contrib.auth.models import Group
from django.http.response import HttpResponseRedirect
from django.shortcuts import render, redirect
from django import views
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse, reverse_lazy
from django.contrib.auth import authenticate, login
from django.views.generic import CreateView, UpdateView, DetailView, DeleteView
from .models import Profile, User
from .forms import UserProfileForm, SignupForm, AuthenticationForm
from django.contrib.auth.mixins import LoginRequiredMixin
def home(request):
    context = {
        'login_form': AuthenticationForm(),
        'signup_form': SignupForm()
    }
    return render(request, 'partials/login_container.html', context)


class SignUp(CreateView):
    model = User
    form_class = SignupForm
    template_name = 'registration/signup.html'
    success_url = reverse_lazy('stormy:home')
    failed_message = "Couldn't sign you up, try again!"

    def form_valid(self, form):
        valid = super(SignUp, self).form_valid(form)
        user = authenticate(
            username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
        if user:
            login(self.request, user)
        return super().form_valid(form)

    def form_invalid(self, form):
        """If the form is invalid, render the invalid form."""
        return render(self.request, 'partials/login_container.html', {'signup_form': form, 'login_form': AuthenticationForm()})



class ProfileUpdate(LoginRequiredMixin,UpdateView):
    model = Profile
    form_class = UserProfileForm
    template_name = 'forms/profile-form.html'
    success_url = 'profileDetail'
    failed_message = "The profile couldn't be updated"


class ProfileDetail(LoginRequiredMixin,DetailView):
    model = Profile
    template_name = 'partials/profile.html'