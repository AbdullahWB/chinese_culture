from django.urls import path
from festivalsAndTraditions.views import festivalsAndTraditions

app_name = "festivalsAndTraditions"

urlpatterns = [
    path("", festivalsAndTraditions)
]