from django.urls import path
from artAndArchitecture.views import artAndArchitecture

app_name = "artAndArchitecture"

urlpatterns = [
    path("", artAndArchitecture)
]