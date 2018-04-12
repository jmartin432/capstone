from django.conf.urls import url
from . import views
from django.urls import path

app_name = 'game'
urlpatterns = [
    path('', views.index, name='index'),
    path('importstates/', views.importstates, name='importstates'),
    path('savestate/', views.savestate, name='savestate'),
]