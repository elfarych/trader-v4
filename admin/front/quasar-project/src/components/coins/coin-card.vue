<template>
<q-item
  clickable
  class="items-center q-mt-sm rounded-borders justify-between q-pa-md"
  :class="activeCoin ? 'bg-accent' : 'bg-dark'"
  @click="setCoin"
>
  <div>
    {{ coin.name }}
  </div>

  <div :class="coin.orders.length ? 'text-bold' : ''">
    {{ coin.orders.length }}
  </div>
</q-item>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'coin-card',
  computed: {
    ...mapState('orders', ['selectedCoins']),
    activeCoin () {
      return !!this.selectedCoins.find(coin => coin.id === this.coin.id)
    }
  },
  props: {
    coin: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    setCoin () {
      const selectedCoins = JSON.parse(JSON.stringify(this.selectedCoins))
      const selectedCoin = this.selectedCoins.find(coin => coin.id === this.coin.id)
      if (!selectedCoin) {
        selectedCoins.push(this.coin)
      } else {
        selectedCoins.splice(selectedCoins.findIndex(item => item.id === this.coin.id), 1)
      }
      this.mutationSelectedCoins(selectedCoins)
    },
    ...mapMutations('orders', ['mutationSelectedCoins'])
  }
}
</script>

<style scoped>

</style>
