import axios from 'axios'
import config from 'src/config'

export async function reloadData ({ dispatch }) {
  await dispatch('loadOrders')
  await dispatch('loadCoins')
  return null
}

export async function loadOrders ({ commit }) {
  try {
    await axios.get(`${config.serverURI}/orders/`).then(res => {
      commit('mutationOrders', res.data.results)
    })
  } catch (e) {
    console.log(e)
  }
}

export async function loadCoins ({ commit }) {
  try {
    await axios.get(`${config.serverURI}/coins/list/`).then(res => {
      commit('mutationCoins', res.data.results)
    })
  } catch (e) {
    console.log(e)
  }
}
