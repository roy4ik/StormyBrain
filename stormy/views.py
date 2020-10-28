from django.urls.base import reverse_lazy
from accounts.forms import SignupForm, AuthenticationForm
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import redirect, render 
from . import models

# Create your views here.
def home(request):
    context={
        'login_form': AuthenticationForm(),
        'signup_form': SignupForm()
    }
    return render(request, 'partials/login_container.html', context)

def stormy(request, storm_pk):
    context={
        'storm' : request.user.profile.storm.objects.get(pk=storm_pk)
    }
    return render(request, 'stormy.html', context)

def addStorm(request):
    if request.user.is_authenticated:
        storm = models.Storm()
        storm.user = request.user
        storm.save()
        return redirect(reverse_lazy(stormy, kwargs={'storm_pk': storm.pk}))
    else:
        pass  # todo: create page for user not logged in, redirect to home on timer

def saveWord(request, storm_pk, word_to_save, coords_x, coords_y):
    if request.user.is_authenticated:
        storm = request.user.profile.storm.objects.get(pk=storm_pk)
        if storm:
           userword =  get_or_create_userword(storm, word_to_save, coords_x, coords_y)
    else:
        pass  # todo: create page for user not logged in, redirect to home on timer


def get_or_create_userword(storm, word_to_save, coords_x, coords_y):
    userword, created = storm.catalyst.objects.get_or_create(
                word = models.Word.get_or_create(name=word_to_save),
                user_storm=storm,
                coord_x = coords_x,
                coord_y = coords_y) 
    if created:
        print(f"Catalyst added : {word_to_save}")
        initial = userword.cloud.add(initial = userword.self)
        initial.save_m2m()
    return userword

def update_userword_relation(request, storm_pk, initial_word, next_word, rel_score):
    storm = request.user.profile.storm.objects.get(pk=storm_pk)
    relation = storm.catalyst.userword.objects.get(word=initial_word).cloud[0]
    relation.next = next_word
    relation.rel_score = rel_score
    relation.save()
    print("relation added")
    return relation
    
    