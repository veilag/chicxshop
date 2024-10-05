from django.urls import path
from . import views

urlpatterns = [
    path('create', views.handle_order_creation)
]
