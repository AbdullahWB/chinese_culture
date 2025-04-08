from django.urls import path
from mandarin_language.views import mandarin_language

app_name = "mandarin_language"

urlpatterns = [
    path("", mandarin_language)
]