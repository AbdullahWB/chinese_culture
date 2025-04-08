from django.urls import path
from chinesePhilosophy.views import chinesePhilosophy

app_name = "chinesePhilosophy"

urlpatterns = [
    path("", chinesePhilosophy)
]