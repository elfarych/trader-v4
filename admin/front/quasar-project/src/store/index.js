import Vue from 'vue'
import Vuex from 'vuex'

import orders from './modules/orders'
Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      orders
    },

    strict: process.env.DEBUGGING
  })

  return Store
}
