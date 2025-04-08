from django.shortcuts import render

# Create your views here.

def artAndArchitecture(request):
    return render(request, 'artAndArchitecture/index.html')
