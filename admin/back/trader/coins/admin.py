from django.contrib import admin
from . import models


@admin.register(models.Coin)
class CoinAdmin(admin.ModelAdmin):
    list_display = ('name', 'rank', 'density', 'active')
    list_editable = ('active',)
    search_fields = ('name', 'symbol')
    list_filter = ('active',)
