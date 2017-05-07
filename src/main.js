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
Vue.http.options.emulateJSON = true

new Vue({
  el: '#app',
  router,
  store,
  render: r => r(App)
})
