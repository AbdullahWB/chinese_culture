from django.urls import path
from modernChina.views import modernChina

app_name = "modernChina"

urlpatterns = [
    path("", modernChina)
]