from django.shortcuts import render

# Create your views here.
def famousFigures(request):
    return render(request, 'famousFigures/index.html')