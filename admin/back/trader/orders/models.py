from django.db import models
from coins.models import Coin


class Order(models.Model):
    coin = models.ForeignKey(Coin, on_delete=models.SET_NULL, null=True, related_name='orders')
    type = models.CharField(max_length=20, null=True, blank=True)
    price = models.CharField(max_length=30, null=True, blank=True)
    stop_loss = models.CharField(max_length=30, null=True, blank=True)
    take_profit = models.CharField(max_length=30, blank=True, null=True)
    reason_density = models.CharField(max_length=30, null=True, blank=True)
    reason_price = models.CharField(max_length=30, null=True, blank=True)
    loss_order = models.BooleanField(default=False)
    profit_order = models.BooleanField(default=False)
    profit_percent = models.FloatField(null=True, blank=True)
    loss_percent = models.FloatField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return f'{self.coin} - {self.type} -- {self.price}'

    class Meta:
        ordering = ('-date',)


