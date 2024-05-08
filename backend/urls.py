from django.urls import path

from . import views
from backend.views import *

app_name = "backend"

urlpatterns = [
    path("index", views.index, name="index"),
    path("", views.front, name="front"),
    path('call-gpt/', call_gpt, name='call_gpt'),
] 

