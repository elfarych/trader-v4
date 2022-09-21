from rest_framework import serializers
from coins.serializers import CoinSerializer
from . import models


class OrderSerializer(serializers.ModelSerializer):
    coin = CoinSerializer(many=False, read_only=True)

    class Meta:
        model = models.Order
        fields = '__all__'


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = '__all__'
