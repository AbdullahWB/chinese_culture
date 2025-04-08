from django.shortcuts import render

# Create your views here.
def chinesePhilosophy(request):
    return render(request, 'chinesePhilosophy/index.html')