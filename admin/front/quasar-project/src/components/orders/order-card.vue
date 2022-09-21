<template>
  <div>
    <q-card class="order-card cursor-pointer" @click="mutationSelectedOrder(order)">
      <q-card-section class="q-pa-sm">
        <div class="row items-center">
          <div class="col-2 relative-position q-pl-lg ">
            <div :class="order.profit_order ? 'bg-positive' : 'bg-negative'" class="order-color-block"></div>
            {{ order.coin.name }}
          </div>

          <div class="col-2 text-bold">
            {{ order.price  }}
          </div>

          <div class="col-2 text-bold">
            {{ order.stop_loss || order.take_profit  }}
          </div>

          <div class="col-1 text-bold" :class="order.profit_order ? 'text-positive' : 'text-negative'">
            {{ order.profit_percent || order.loss_percent || '? ' }}%
          </div>

          <div class="col-2 text-bold">
            {{ order.reason_density  }}
          </div>

          <div class="col-1">
            <q-btn
              :label="order.type"
              outline flat
              :color="order.type === 'BUY' ? 'positive' : 'negative'"
              class="full-width"
            />
          </div>
          <div class="col-2 text-center">
            {{ date }}
          </div>
        </div>
      </q-card-section>

    </q-card>
  </div>

</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'order-card',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    date () {
      return new Intl.DateTimeFormat('ru', {
        minute: '2-digit',
        hour: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(this.order.date))
    }
  },
  methods: {
    ...mapMutations('orders', ['mutationSelectedOrder'])
  }
}

// coin:"Solana (SOL)"
// date:"2022-09-12T16:11:36.971525+06:00"
// id:72
// loss_order:false
// loss_percent:null
// price:"37.47"
// profit_order:true
// profit_percent:0.29
// reason_density:"511,302.505"
// reason_price:null
// stop_loss:"37.37"
// take_profit:"37.58"
// type:"BUY"
</script>

<style lang="sass">
.order-color-block
  position: absolute
  left: 0
  top: 0
  bottom: 0
  width: 10px
  border-radius: 4px
</style>
