<template>
<div class="order-chart">
  <q-dialog v-model="dialog" persistent>
    <q-card style="width: 950px; padding-left: 25px; max-width: 100%; height: 600px; padding-top: 35px" class="relative-position">
      <q-btn
        dense flat
        style="position: absolute; top: 5px; right: 5px"
        icon-right="close"
        @click="closeChart"
      />
      <div id="order-chart-id" style="width: 900px; max-width: 100%; height: 450px"></div>
    </q-card>
  </q-dialog>
</div>
</template>

<script>
import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'order-chart',
  data () {
    return {
      dialog: true,
      candleSeries: [],
      candles: []
    }
  },
  computed: {
    ...mapState('orders', ['selectedOrder'])
  },
  methods: {
    ...mapMutations('orders', ['mutationSelectedOrder']),

    closeChart () {
      this.mutationSelectedOrder(null)
    },

    async loadCandles () {
      const date = new Date(this.selectedOrder.date)
      date.setMinutes(date.getMinutes() - 420)
      const startTime = date.getTime()
      try {
        return await this.$axios.get('https://api.binance.com/api/v3/klines', {
          params: {
            symbol: `${this.selectedOrder.coin.symbol}USDT`,
            limit: 140,
            interval: '5m',
            startTime
          }
        }).then(res => {
          const candleData = []
          const volumeData = []
          res.data.forEach(item => {
            const candle = {
              time: item[0], open: item[1], high: item[2], low: item[3], close: item[4]
            }
            const vol = {
              time: item[0], value: item[7], color: 'rgba(0, 150, 136, 0.2)'
            }
            candleData.push(candle)
            volumeData.push(vol)
          })
          return {
            candleData,
            volumeData
          }
        })
      } catch (e) {
        console.log(e)
      }
    },

    async setChartCandlesData () {
      const vm = this
      const klines = await this.loadCandles()
      vm.candles = klines?.candleData
      vm.candleSeries.setData(vm.candles)
    },

    async createChart () {
      const vm = this
      const element = document.getElementById('order-chart-id')
      vm.chart = createChart(element, {
        width: element.offsetWidth,
        height: 550,
        layout: {
          backgroundColor: 'transparent',
          textColor: 'rgba(255, 255, 255, 0.9)'
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            visible: true,
            labelVisible: false
          },
          horzLine: {
            visible: true
          }
        },
        grid: {
          vertLines: {
            color: '#1e222d'
          },
          horzLines: {
            color: '#1e222d'
          }
        },
        rightPriceScale: {
          visible: true
        },
        timeScale: {
          visible: false
        },
        localization: {
          priceFormatter: function (price) { return parseFloat(price).toFixed(vm.selectedOrder.coin.digits) }
        }
      })
      vm.candleSeries = vm.chart.addCandlestickSeries({
        upColor: vm.upColor,
        downColor: vm.downColor,
        borderDownColor: vm.downColor,
        borderUpColor: vm.upColor,
        wickDownColor: vm.downColor,
        wickUpColor: vm.upColor
      })
      vm.candleSeries.setMarkers([
        { time: new Date(new Date(vm.selectedOrder.date).setMinutes(new Date(vm.selectedOrder.date).getMinutes() - 5)).getTime(), position: 'aboveBar', color: '#ffffff', shape: 'arrowDown', text: 'Open' }
      ])

      // Open
      vm.candleSeries.createPriceLine({
        price: vm.selectedOrder.price,
        color: '#9c27b0',
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
        axisLabelVisible: true,
        title: vm.selectedOrder.type
      })

      // Close
      vm.candleSeries.createPriceLine({
        price: vm.selectedOrder.loss_percent ? vm.selectedOrder.stop_loss : vm.selectedOrder.take_profit,
        color: vm.selectedOrder.loss_percent ? 'red' : 'green',
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
        axisLabelVisible: true,
        title: vm.selectedOrder.loss_percent ? `Loss ${vm.selectedOrder.loss_percent}%` : `Profit ${vm.selectedOrder.profit_percent}%`
      })
    }
  },
  async mounted () {
    setTimeout(async () => {
      await this.createChart()
      await this.setChartCandlesData()
    }, 1000)
  },
  watch: {
    selectedOrder (val) {
      if (val) {
        this.dialog = true
      }
    }
  }
}
</script>

<style scoped>

</style>
