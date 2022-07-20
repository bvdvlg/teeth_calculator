from django.contrib import admin
from django.urls import path, include
from mainapp import views
from django.shortcuts import redirect

urlpatterns = [
    path('camera/', views.camera, name="camera"),
    path('about/', views.about, name="about"),
    path('main/', views.main, name="main"),
    path('results/', views.results, name="results"),
    path('photo_threater/', views.photo_threater, name="photo_threater")
]