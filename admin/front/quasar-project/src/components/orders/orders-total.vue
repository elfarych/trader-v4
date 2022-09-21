<template>
  <div class="orders-total row items-center q-my-md">
    <div class="col-2 text-bold">
      Trades: {{ totalOrdersCount }} / <span class="text-positive">{{ totalProfitTradesCount }}</span> /
      <span class="text-negative">{{ totalLossTradesCount }}</span>
    </div>

    <div class="col-3 text-bold">
      Profit: {{ totalPercent }}% / <span class="text-positive">{{ totalProfitPercent }}%</span> /
      <span class="text-negative">{{ totalLossPercent }}%</span>
    </div>

    <div class="col-2 text-bold">Buy orders: {{ totalBuyOrders }}</div>
    <div class="col-2 text-bold">Sell orders: {{ totalSellOrders }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'orders-total',
  computed: {
    ...mapGetters('orders', ['getOrders']),
    totalOrdersCount () {
      return this.getOrders.length
    },
    totalProfitTradesCount () {
      return this.getOrders.filter(item => item.profit_order).length
    },
    totalLossTradesCount () {
      return this.getOrders.filter(item => item.loss_order).length
    },
    totalPercent () {
      let total = 0
      this.getOrders.forEach(item => {
        if (item.profit_percent) total += item.profit_percent
        if (item.loss_percent) total = total - item.loss_percent
      })

      return total.toFixed(2)
    },
    totalProfitPercent () {
      let total = 0
      this.getOrders.forEach(item => {
        if (item.profit_percent) total += item.profit_percent
      })

      return total.toFixed(2)
    },
    totalLossPercent () {
      let total = 0
      this.getOrders.forEach(item => {
        if (item.loss_percent) total += item.loss_percent
      })

      return total.toFixed(2)
    },
    totalBuyOrders () {
      let total = 0
      this.getOrders.forEach(item => {
        if (item.type === 'BUY') total += 1
      })

      return total
    },
    totalSellOrders () {
      let total = 0
      this.getOrders.forEach(item => {
        if (item.type === 'SELL') total += 1
      })

      return total
    }
  }
}
</script>

<style scoped>

</style>
