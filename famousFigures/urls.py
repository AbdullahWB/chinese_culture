from django.urls import path
from famousFigures.views import famousFigures

app_name = "famousFigures"

urlpatterns = [
    path("", famousFigures)
]