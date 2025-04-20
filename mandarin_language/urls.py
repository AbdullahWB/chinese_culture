from django.urls import path
from . import views

app_name = "mandarin_language"

urlpatterns = [
    path("", views.index, name="index"),
    path("ask-assistant/", views.ask_assistant, name="ask_assistant"),
]