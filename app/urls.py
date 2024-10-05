from django.conf.urls.static import static
from django.contrib import admin
from django.conf import settings
from django.urls import path, include

urlpatterns = [
    path('', include('home.urls')),
    path('', include('products.urls')),
    path('', include('users.urls')),

    path('order/', include('order.urls')),
    path('store', include('shop.urls')),
    path('admin/', admin.site.urls),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
