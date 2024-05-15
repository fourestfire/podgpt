from django.urls import path

from . import views
from backend.views import *

app_name = "backend"

urlpatterns = [
    path("", views.index, name="index"),
    path("front", views.front, name="front"),
    path("emoji", views.front, name="emoji"),
    path("vision", views.front, name="vision"),
    path('call-gpt/', call_gpt, name='call_gpt'),
    path('api/call-gpt/', call_gpt, name='call_gpt'), # only one of these routes is used, depending on nginx config
] 

