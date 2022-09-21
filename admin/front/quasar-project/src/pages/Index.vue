<template>
  <q-page class="q-px-md q-pt-md">
    <div class="row">
      <div class="col-2">
        <div class="flex justify-between">
          <div class="text-h5 text-bold text-uppercase">Trader v3</div>
          <q-btn
            label="Reload"
            dense
            no-caps
            color="accent"
            class="q-px-md q-mr-md"
            :loading="loading"
            @click="reload"
          />
        </div>

        <div class="q-pr-md">
          <coins />
        </div>
      </div>
      <div class="col-10">
        <orders />
      </div>
    </div>

    <order-chart v-if="selectedOrder"/>

  </q-page>
</template>

<script>
import Orders from 'components/orders/orders'
import Coins from 'components/coins/coins'
import { mapActions, mapState } from 'vuex'
import OrderChart from 'components/charts/order-chart'
export default {
  name: 'PageIndex',
  components: { OrderChart, Coins, Orders },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState('orders', ['selectedOrder'])
  },
  methods: {
    ...mapActions('orders', ['reloadData']),
    async reload () {
      this.loading = true
      await this.reloadData()
      this.loading = false
    }
  }
}
</script>
