from . import models
from django.shortcuts import render


def collection(request, slug):
    selected_collection = models.Collection.objects.get(slug=slug)
    context = {"collection": selected_collection}

    return render(request, 'collection/collection.html', context)


def product(request, id):
    selected_product = models.Product.objects.get(pk=id)
    context = {"product": selected_product}

    return render(request, 'products/product.html', context)
