from django.shortcuts import render

# Create your views here.
def modernChina(request):
    return render(request, 'modernChina/index.html')