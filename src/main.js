import 'bootstrap/dist/css/bootstrap.css'
import 'element-ui/lib/theme-default/index.css'
import '~assets/styles/common.styl'

import Vue from 'vue'
import App from './App.vue'
import router from './routers'
import store from './store'
import VueResource from 'vue-resource'

import ElementUI from 'element-ui'

import config from './utils/config'

Vue.use(VueResource)
Vue.use(ElementUI)

Vue.http.options.root = '/api/v1'
Vue.http.options.emulateJSON = true

if (config.debug) {
  window.LJWallet = {
    'address': 'AJnNUn6HynVcco1p8LER72s4zXtNFYDnys',
    'publicKeyCompressed': '03a51482ce5299652d787f02422e4d57f647848392f024b8580fa39137a2342a7f',
    'publicKey': '04a51482ce5299652d787f02422e4d57f647848392f024b8580fa39137a2342a7f930c5e78325a3e2fb882360e92482577b67cae752d001ad4dfacb91eea672f35',
    'privateKeyEncrypted': 'U2FsdGVkX1+p3RdaPalMP9zPvN36l5SBnYTWLX+sqjAVFClqzDqkJ9SAV1xy4Wq3JHnooOWWtwUblyPIEH1p9lhGJ9XYuq60pHmzCAta5pfAOpiel0qXJG2bYoVkGnuW',
    'privateKey': 'd0cf26d192e1486d4cdd1eb2ed10aa7e1c55f37db52dd19a2d8fc63a804ffb3e',
  }
}

new Vue({
  el: '#app',
  router,
  store,
  render: r => r(App)
})
