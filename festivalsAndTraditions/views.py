from django.shortcuts import render

# Create your views here.
def festivalsAndTraditions(request):
    return render(request, 'festivalsAndTraditions/index.html')