from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.


class Measurement(models.Model):
    name = models.CharField(max_length=50, verbose_name='Название эксперимента')
    result = models.JSONField()
