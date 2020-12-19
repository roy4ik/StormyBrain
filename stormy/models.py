from django.db import models
from accounts.models import Profile
# Create your models here.    
# Profile > Storm > UserWord >               > Word
#                            <  WordRelation >

class Word(models.Model):
    name = models.CharField(max_length=255)

class UserWord(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='user_word')
    user_storm = models.ForeignKey('Storm', on_delete=models.CASCADE)
    cloud = models.ManyToManyField('self', through='WordRelation')

    def __str__(self):
        return f'{self.word}'

class WordRelation(models.Model):
    initial = models.ForeignKey(UserWord, on_delete=models.CASCADE, related_name='initial')
    next = models.ForeignKey(UserWord, on_delete=models.CASCADE)
    rel_score = models.IntegerField()
    rel_pos = models.IntegerField()

    def __str__(self):
        return f'{self.initial} > {self.next}'

class Storm(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.PROTECT)
    is_active = models.BooleanField(default = True)
    date_created = models.DateField(auto_now_add=True)
    date_updated = models.DateField(auto_now=True)
    catalyst = models.ForeignKey(UserWord, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'{self.catalyst}'