from rest_framework import generics
from . import models
from . import serializers


class CoinsListView(generics.ListAPIView):
    serializer_class = serializers.CoinSerializer
    queryset = models.Coin.objects.filter(active=True)


class CoinView(generics.RetrieveAPIView):
    serializer_class = serializers.CoinSerializer
    queryset = models.Coin.objects.all()
