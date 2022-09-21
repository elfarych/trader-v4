<template>
<div class="orders">

  <orders-filter />

  <q-separator dark class="q-my-sm"/>

  <orders-table-header />

  <q-scroll-area style="height: calc(100vh - 185px)">
    <order-card
      v-for="order in getOrders"
      :key="order.id"
      :order="order"
      class="q-mb-sm"
    />
  </q-scroll-area>

  <orders-total />

</div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import OrderCard from 'components/orders/order-card'
import OrdersFilter from 'components/orders/orders-filter'
import OrdersTableHeader from 'components/orders/orders-table-header'
import OrdersTotal from 'components/orders/orders-total'

export default {
  name: 'orders',
  components: { OrdersTotal, OrdersTableHeader, OrdersFilter, OrderCard },
  computed: {
    ...mapGetters('orders', ['getOrders'])
  },
  methods: {
    ...mapActions('orders', ['loadOrders'])
  },
  created () {
    this.loadOrders().then(() => console.log('orders loaded...'))
  }
}
</script>

<style scoped>

</style>
