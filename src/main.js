
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

import {
    Net,
    DataStore,
    Jump,
    Common,
    normalYear
} from './utils/utils.js'

Vue.prototype.$Net = Net
Vue.prototype.$Jump = Jump
Vue.prototype.$Common = Common
Vue.prototype.$DataStore = DataStore

import apis from './utils/api.js'
Vue.prototype.$api= apis

import BASE_URL from "./utils/config"
Vue.prototype.$baseUrl = BASE_URL

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif