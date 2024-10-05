from django.urls import path
from . import views

urlpatterns = [
    path("collections/<slug:slug>", views.collection),
    path("products/<int:id>", views.product)
]
