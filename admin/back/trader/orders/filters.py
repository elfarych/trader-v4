from django_filters import rest_framework as filters
from . import models


class CharFilterInFilter(filters.BaseInFilter, filters.CharFilter):
    pass


class OrdersFilter(filters.FilterSet):
    coin = CharFilterInFilter(field_name='coin', lookup_expr='in')
    type = CharFilterInFilter(field_name='type')

    class Meta:
        model = models.Order
        fields = ['coin', 'type']
