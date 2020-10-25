from django.db import models
# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    img = models.ImageField(upload_to = 'media/usr/profile/img/', default='media/usr/defaults/profile/img/default.jpg')
    job_title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)