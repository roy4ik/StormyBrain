from django.db import models
from accounts.models import Profile
# Create your models here.    
# Profile > Storm > UserWord >               > Word
#                            <  WordRelation >

class Word(models.Model):
    name = models.CharField(max_length=255)

class UserWord(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    user_storm = models.ForeignKey('Storm', on_delete=models.CASCADE)
    cloud = models.ManyToManyField('WordRelation')
    coord_x = models.IntegerField()
    coord_y = models.IntegerField()

class WordRelation(models.Model):
    initial = models.ForeignKey(UserWord, on_delete=models.CASCADE, related_name='initial')
    next = models.ForeignKey(UserWord, on_delete=models.CASCADE, related_name='next')
    rel_score = models.IntegerField()

class Storm(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.PROTECT)
    is_active = models.BooleanField()
    date_created = models.DateField(auto_now_add=True)
    date_updated = models.DateField(auto_now=True)
    catalyst = models.ForeignKey(UserWord, on_delete=models.CASCADE)