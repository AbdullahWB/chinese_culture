from django.urls import path
from poem.views import poem

app_name = "poem"

urlpatterns = [
    path("", poem)
]