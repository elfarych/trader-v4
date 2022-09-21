export function mutationOrders (state, data) {
  state.orders = data
}

export function mutationOrderFilters (state, data) {
  state.filters = {
    ...state.filters,
    ...data
  }
}

export function mutationSelectedOrder (state, data) {
  state.selectedOrder = data
}

export function mutationSelectedCoins (state, coins) {
  state.selectedCoins = coins
}

export function mutationCoins (state, data) {
  state.coins = data
}
