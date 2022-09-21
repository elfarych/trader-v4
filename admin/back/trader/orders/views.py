from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from . import models
from . import serializers
from . import filters


class OrdersView(generics.ListCreateAPIView):
    serializer_class = serializers.OrderSerializer
    queryset = models.Order.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = filters.OrdersFilter


class OrderView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.OrderSerializer
    queryset = models.Order.objects.all()


class CreateOrderView(generics.CreateAPIView):
    serializer_class = serializers.OrderCreateSerializer
    queryset = models.Order.objects.all()