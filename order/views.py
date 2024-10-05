import json
import os

import requests
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from products import models

BOT_TOKEN = os.getenv("TELEGRAM_API_KEY")
URL = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"


def send_admin_message(order_id, products):
    product_list_string = ""
    for index, product in enumerate(products):
        product_list_string += f"{index} - {product.title}\n"

    requests.post(URL, data={
        'chat_id': 898008765,
        'parse_mode': 'Markdown',
        'text': f'*Создан заказ под номером {order_id}*\n\n*В заказе:*\n\n{product_list_string}',
    })


def handle_order_creation(request):
    data = json.loads(request.body)
    product_list = data.get("products", [])
    product_ids = [item.get("id") for item in product_list]
    count_map = {item.get("id"): item.get("count") for item in product_list}
    products = models.Product.objects.filter(pk__in=product_ids)

    if len(products) != len(product_ids):
        missing_ids = set(product_ids) - {product.id for product in products}
        return JsonResponse({
            "message": f"Продукты под номерами {', '.join(map(str, missing_ids))} не найдены"
        }, status=404)

    total_price = sum(product.price * count_map[product.id] for product in products)
    order_status = get_object_or_404(models.OrderStatus, pk=1)

    with transaction.atomic():
        order = models.Order.objects.create(
            user=request.user,
            status=order_status,
            total_price=total_price
        )
        order.products.add(*products)

    send_admin_message(order.id, products)
    return JsonResponse({"message": "Заказ создан"}, status=200)
