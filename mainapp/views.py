import jinja2
from django.shortcuts import render
from django.template import RequestContext

# Create your views here.


def camera(request):
    return render(request, 'camera.html')


def main(request):
    return render(request, 'main.html')


def about(request):
    return render(request, 'about.html')


def results(request):
    return render(request, 'results.html')

def photo_threater(request):
    return render(request, 'photo_threater.html')