export function getOrders (state) {
  let orders = JSON.parse(JSON.stringify(state.orders))
  const filters = state.filters

  if (!state.orders.length) return []

  if (filters.density) {
    orders = orders.filter(item => {
      if (!filters.density) return true
      return item.reason_density && parseInt(item.reason_density.replaceAll(',', '')) >= filters.density
    })
  }

  if (filters.type) {
    orders = orders.filter(item => {
      return item.type === filters.type.toUpperCase()
    })
  }

  if (state.selectedCoins.length) {
    orders = orders.filter(order => {
      const coin = state.selectedCoins.find(item => item.id === order.coin.id)
      return !!coin
    })
  }

  if (filters.lossOrders) {
    orders = orders.filter(item => item.loss_order)
  }

  if (filters.profitOrders) {
    orders = orders.filter(item => item.profit_order)
  }

  return orders
}
