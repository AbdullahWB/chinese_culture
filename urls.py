"""
URL configuration for chinese_culture project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

# from core.views import index
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("home/", include('core.urls')),
    path("chinesePhilosophy/", include('chinesePhilosophy.urls'), name="chinesePhilosophy"),
    path("artAndArchitecture/", include('artAndArchitecture.urls')),
    path("famousFigures/", include('famousFigures.urls')),
    path("festivalsAndTraditions/", include('festivalsAndTraditions.urls')),
    path("mandarin_language/", include('mandarin_language.urls')),
    path("modernChina/", include('modernChina.urls')),
    path("poem/", include('poem.urls')),
    path("Tourism/", include('Tourism.urls')),
    path("__reload__/", include("django_browser_reload.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)