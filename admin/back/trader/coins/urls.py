from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.CoinsListView.as_view()),
    path('detail/<int:pk>/', views.CoinView.as_view())
]
