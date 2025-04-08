from django.shortcuts import render

# Create your views here.
def mandarin_language(request):
    return render(request, 'mandarin_language/index.html')