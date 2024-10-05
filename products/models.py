from django.contrib.auth.models import User
from django.db import models


class Product(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    image_preview = models.ImageField(upload_to="media")
    price = models.IntegerField()

    def __str__(self):
        return self.title


class Collection(models.Model):
    title = models.CharField(max_length=150, default="Название одежды")
    description = models.TextField(blank=True)
    products = models.ManyToManyField(Product, related_name='collections')
    icon = models.ImageField(upload_to="media/icons", null=True)
    slug = models.SlugField(default="", null=False)

    def __str__(self):
        return self.title


class Category(models.Model):
    title = models.CharField(max_length=150, default="Безымянная категория")
    products = models.ManyToManyField(Product, related_name='categories')

    def __str__(self):
        return self.title


class OrderStatus(models.Model):
    title = models.CharField(max_length=150, default="Безымянный статус")
    description = models.TextField(default="Без описания")

    def __str__(self):
        return self.title


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.ForeignKey(OrderStatus, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, related_name='orders')
    total_price = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_at.strftime('%Y-%m-%d => %H:%M')}"
