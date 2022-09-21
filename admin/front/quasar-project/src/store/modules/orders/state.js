export default function () {
  return {
    orders: [],
    coins: [],
    selectedOrder: null,
    selectedCoins: [],
    types: ['Buy', 'Sell'],
    filters: {
      density: 0,
      lossOrders: false,
      profitOrders: false,
      type: ''
    }
  }
}
