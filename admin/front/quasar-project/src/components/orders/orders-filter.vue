<template>
<div class="orders-filter">
  <div class="q-pb-sm rounded-borders">
    <div class="row">
      <div class="col-2 flex">
        <q-checkbox
          :value="filters.profitOrders"
          label="Profit"
          class="q-ml-md"
          color="accent"
          @input="setProfitOrders"
        />
        <q-checkbox
          :value="filters.lossOrders"
          label="Loss"
          class="q-ml-md"
          color="accent"
          @input="setLossOrders"
        />
      </div>

      <div class="col-3 flex">
        <q-btn
          v-for="type in types"
          :key="type"
          :label="type"
          :color="filters.type === type ? 'accent' : 'dark'"
          class="q-ml-sm"
          size="sm"
          @click="setType(type)"
        />
      </div>

      <div class="col-3">
        <div>{{ `Density: ${formattedDensity}` }}</div>
        <q-slider
          :value="filters.density"
          :step="100000"
          :min="0"
          :max="5000000"
          dense
          @input="setDensity"
        />
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'orders-filter',
  computed: {
    ...mapState('orders', ['coins', 'types', 'filters', 'selectedCoins']),
    formattedDensity () {
      return new Intl.NumberFormat('en').format(this.filters.density)
    }
  },
  methods: {
    ...mapMutations('orders', ['mutationOrderFilters']),
    setDensity (val) {
      this.mutationOrderFilters({ density: val })
    },
    setType (val) {
      let type = val
      if (this.filters.type === val) {
        type = ''
      }
      this.mutationOrderFilters({ type })
    },
    setProfitOrders (val) {
      this.mutationOrderFilters({ profitOrders: val })
    },
    setLossOrders (val) {
      this.mutationOrderFilters({ lossOrders: val })
    },
    getCoinColor (coin) {
      if (this.selectedCoins.includes(coin)) return 'accent'
      return 'dark'
    }
  }
}
</script>

<style scoped>

</style>
