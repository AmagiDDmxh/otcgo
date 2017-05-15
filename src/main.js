import 'bootstrap/dist/css/bootstrap.css'
import 'element-ui/lib/theme-default/index.css'
import '~assets/styles/common.styl'

import Vue from 'vue'
import _ from 'lodash'
import VueResource from 'vue-resource'
import Vuelidate from 'vuelidate'

import App from './App.vue'
import router from './routers'
import store from './store'

import ElementUI from 'element-ui'

Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(Vuelidate)

// Define lodash, make it use as this.$_ instead of globally
Object.defineProperty(Vue.prototype, '$_', { value: _ })

Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.http.options.root = '/api/v1'
Vue.http.options.emulateJSON = true;

(function s(str) {
  const redeem = '21' + str + 'ac'
  const unhex = CryptoJS.enc.Hex.parse(redeem)
  const scriptHash = CryptoJS.enc.Hex.parse('17' + CryptoJS.RIPEMD160(CryptoJS.SHA256(unhex)).toString())
  const address = scriptHash + CryptoJS.SHA256(CryptoJS.SHA256(scriptHash)).toString().substring(0, 8)
  console.log("[ADDRESS] ", address)
  console.log("[TYPEOF] ", typeof address)
  const bytes = Buffer.from(address, 'hex')
  console.log("[BYTES] ", bytes)
  console.log("[ENCODE] ", Base58.encode(bytes))
  return Base58.encode(bytes)
})("171fac0f78244cc0ac1561dbf72a743deab646e61078a9cc66");

new Vue({
  el: '#app',
  router,
  store,
  render: r => r(App)
})
