from django.contrib import admin
from . import models


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('coin', 'type', 'price', 'reason_density', 'reason_price', 'loss_order', 'profit_order', 'date')
    list_filter = ('type', 'loss_order', 'profit_order', 'date', 'coin')