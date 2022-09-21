from rest_framework import serializers

from . import models
from orders.models import Order


class OrdersSerializer (serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = ('id',)


class CoinSerializer(serializers.ModelSerializer):
    orders = OrdersSerializer(many=True, read_only=True)

    class Meta:
        model = models.Coin
        fields = '__all__'
