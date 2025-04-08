from django.urls import path
from Tourism.views import Tourism

app_name = "Tourism"

urlpatterns = [
    path("", Tourism)
]