from django.contrib import admin
from django.urls import path, include
from .yasg import urlpatterns as doc_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('orders.urls')),
    path('coins/', include('coins.urls'))
]

urlpatterns += doc_urls

