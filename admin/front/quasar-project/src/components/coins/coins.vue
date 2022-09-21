<template>
<div class="coins">
  <q-input
    v-model="searchText"
    outlined
    dense
    class="q-mt-md"
  />

  <div class="q-mt-xs">
    <q-scroll-area style="height: calc(100vh - 180px)">
      <coin-card
        v-for="coin in filteredCoins"
        :key="coin.id"
        :coin="coin"
      />
    </q-scroll-area>
  </div>

  <q-btn
    label="Clear"
    icon-right="close"
    color="primary"
    :disable="!selectedCoins.length"
    :outline="!selectedCoins.length"
    class="full-width q-mt-sm q-py-xs"
    @click="mutationSelectedCoins([])"
  />
</div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import CoinCard from 'components/coins/coin-card'

export default {
  name: 'coins',
  components: { CoinCard },
  computed: {
    ...mapState('orders', ['coins', 'selectedCoins']),
    filteredCoins () {
      const vm = this
      const coins = JSON.parse(JSON.stringify(vm.coins))
      return coins
        .filter(item => item.name.toLowerCase().includes(vm.searchText.toLowerCase()))
        .sort((a, b) => a.orders.length < b.orders.length ? 1 : -1)
    }
  },
  methods: {
    ...mapActions('orders', ['loadCoins']),
    ...mapMutations('orders', ['mutationSelectedCoins'])
  },
  data () {
    return {
      searchText: ''
    }
  },
  created () {
    const vm = this
    vm.loadCoins()
  }
}
</script>

<style scoped>

</style>
