from django.shortcuts import render

# Create your views here.
def poem(request):
    return render(request, 'poem/index.html')