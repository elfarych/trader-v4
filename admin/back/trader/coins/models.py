from django.db import models


class Coin(models.Model):
    name = models.CharField(max_length=30, null=True, blank=True)
    symbol = models.CharField(max_length=10, null=True, blank=True)
    density = models.FloatField(null=True, blank=True)
    loss_pips = models.FloatField()
    profit_pips = models.FloatField()
    rank = models.IntegerField()
    active = models.BooleanField(default=True)
    in_trade = models.BooleanField(default=False)
    leverage = models.IntegerField(default=20)
    digits = models.IntegerField(default=2)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('rank',)
