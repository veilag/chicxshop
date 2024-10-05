from django.shortcuts import render
from products.models import Collection


def index(request):
    collections = Collection.objects.all()
    context = {"collections": collections}

    return render(request, 'shop/index.html', context)
