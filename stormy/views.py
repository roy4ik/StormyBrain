from django.shortcuts import render

# Create your views here.
def home(request):
    context={}
    return render(request, 'base/base.html', context)


def stormy(request):
    context={}
    return render(request, 'stormy.html', context)