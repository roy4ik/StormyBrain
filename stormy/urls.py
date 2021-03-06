from stormy.views import Stormies, saveWord
from django.urls import path
from . import views
app_name = 'stormy'
urlpatterns = [
    path('', views.home, name="home"),
    path('stormy', views.addStorm, name="add-storm"),
    path('stormies', views.Stormies.as_view(), name="stormies"),
    path('stormy/<int:storm_pk>', views.stormy, name="stormy"),
    path('stormy/<int:storm_pk>/save-word/word=<str:word_to_save>', views.saveWord, name='save-word'),
    path('stormy/<int:storm_pk>/update-userword_rel/initial=<str:initial_word>&next=<str:next_word>&rel_score=<int:rel_score>&rel_pos=<int:rel_pos>', views.update_userword_relation, name='update-relation'),
]
