from django.contrib import admin
from . import models


class ProductAdmin(admin.ModelAdmin):
    fields = ["title", "description", "image_preview", "price"]


class CollectionAdmin(admin.ModelAdmin):
    filter_horizontal = ["products"]
    fields = ["title", "description", "products", "icon", "slug"]


class CategoryAdmin(admin.ModelAdmin):
    filter_horizontal = ["products"]
    fields = ["title", "products"]


class OrderStatusAdmin(admin.ModelAdmin):
    fields = ["title", "description"]


class OrderAdmin(admin.ModelAdmin):
    filter_horizontal = ["products"]
    fields = ["user", "status", "products", "total_price"]


admin.site.register(models.Product, ProductAdmin)
admin.site.register(models.Collection, CollectionAdmin)
admin.site.register(models.Category, CategoryAdmin)
admin.site.register(models.OrderStatus, OrderStatusAdmin)
admin.site.register(models.Order, OrderAdmin)
