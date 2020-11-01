from django.http import request
from django.http.response import HttpResponse
from django.urls.base import reverse_lazy
from accounts.forms import SignupForm, AuthenticationForm
from django.contrib.auth.forms import AuthenticationForm
from django.views.generic import ListView
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
    if request.user.is_authenticated:
        context={
            'storm' : models.Storm.objects.get(user=request.user.profile, pk=storm_pk).pk
        }
        return render(request, 'stormy.html', context)


class Stormies(ListView):
    model = models.Storm
    template_name = 'stormies.html'
    
    def get_context_data(self, **kwargs):
        if self.request.user.is_authenticated:
            context = super().get_context_data(**kwargs)
            context['object_list'] = self.request.user.profile.storm_set.all()
            return context
        

#  API dealers

def addStorm(request):
    """
    Creates new storm object
    #args: request(HTTPRequestobj)
    #returns: nothing
    """
    if request.user.is_authenticated:
        storm = models.Storm()
        storm.user = request.user.profile
        storm.save()
        return redirect(reverse_lazy(stormy, kwargs={'storm_pk': storm.pk}))

def saveWord(request, storm_pk, word_to_save):
    """
    Saves a new word
    #args: request(HTTPRequestobj), storm_pk, word_to_save(str)
    #returns: HTTPResponse
    """
    if request.user.is_authenticated:
        if request.method == 'GET':
            storm = request.user.profile.storm_set.get(pk=storm_pk)
            if storm:
                userword =  get_or_create_userword(request, storm, word_to_save)
            else:
                pass  # todo: create page for user not logged in, redirect to home on timer
            return HttpResponse(status=200)
    else:
        return HttpResponse(status=401)

def get_or_create_userword(request, storm, word_to_save):
    """
    gets /creates userword 
    #args: request(HTTPRequestobj), storm(storm object), word_to_save(str)
    #returns: HTTPResponse
    """
    if request.user.is_authenticated:
        if request.method == 'GET':
            word, created = models.Word.objects.get_or_create(name=word_to_save)
            if created:
                print(f"word created:{word}")
            userword, created = models.UserWord.objects.get_or_create(
                        word = word,
                        user_storm=storm,
                        )
            if created:
                print(f"cloud added : {word_to_save}")
                if storm.catalyst == None:
                    storm.catalyst = userword
                    storm.save()
                    print(f"Catalyst added : {word_to_save}")
                return HttpResponse(status=201)
            else:
                return HttpResponse(status=200)
    else:
        return HttpResponse(status=401)

def update_userword_relation(request, storm_pk, initial_word, next_word, rel_score):
    """
    updates userword_relation for first object in UserWord.cloud for adding next and rel_score 
    #args: request(HTTPRequestobj), storm_pk(int), initial_word(str), next_word(UserWord obj), rel_score(int)
    #returns: HTTPResponse
    """
    if request.user.is_authenticated:
        if request.method == 'GET':
            storm = request.user.profile.storm_set.get(pk=storm_pk)
            initial_word = storm.userword_set.get(word__name=initial_word)
            word = models.Word.objects.get_or_create(name=next_word)[0]
            next_word = storm.userword_set.get_or_create(word=word)[0]
            relation, create = models.WordRelation.objects.get_or_create(initial=initial_word, next=next_word, rel_score=rel_score)
            if create:
                print("relation added")
                return HttpResponse(status=201)
            else:
                relation.delete()
                return HttpResponse(status=200)
    else:
                return HttpResponse(status=401)
        
    
    