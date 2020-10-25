from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    img = models.ImageField(upload_to = 'media/usr/profile/img/', default='media/usr/defaults/profile/img/default.jpg')
    job_title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)

@receiver(post_save, sender=User)
def create_profile(sender, created, instance, **kwargs):
    if created:
        profile = Profile.objects.create(user=instance)


