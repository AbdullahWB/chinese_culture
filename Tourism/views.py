from django.shortcuts import render

# Create your views here.
def Tourism(request):
    return render(request, 'Tourism/index.html')