from stormy.views import saveWord
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('stormy', views.addStorm, name="add-storm"),
    path('stormy/<int:storm_pk>', views.stormy, name="stormy"),
    path('stormy/<int:storm_pk>/save-word?word=<slug:word_to_save>&coords=<int:coords_x>&<int:coords_y>', views.saveWord, name='save-word'),
    path('stormy/<int:storm_pk>/update-userword_rel?initial=<slug:initial_word>&next=<slug:next_word>&rel=<int:rel_score>', views.saveWord, name='update-relation'),
]