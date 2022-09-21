from django.urls import path
from . import views

urlpatterns = [
    path('create_order/', views.CreateOrderView.as_view()),
    path('order/<int:pk>/', views.OrderView.as_view()),
    path('orders/', views.OrdersView.as_view())
]
