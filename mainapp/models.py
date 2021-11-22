from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.


class Measurement(models.Model):
    name = models.CharField(max_length=50, verbose_name='Название эксперимента', unique=True)
    scaleMeasurements = models.JSONField(verbose_name="Измерения масштаба и ширины")
    faceMeasurements = models.JSONField(verbose_name="Измерения диагонали")
    real_width = models.FloatField(verbose_name="Реальная ширина лица")
    real_diag = models.FloatField(verbose_name="Реальная ширина лица")
    diag = models.FloatField(verbose_name="Измеренная ширина лица")
    width = models.FloatField(verbose_name="Измеренная ширина лица")
    distance = models.FloatField(default=0, verbose_name="Расстояние от камеры до человека")
    scale = models.FloatField(default=0, verbose_name="Измеренный масштаб")

    def __str__(self):
        return self.name
