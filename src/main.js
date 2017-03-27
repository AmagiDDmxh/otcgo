import Vue from 'vue'
import VueResource from 'vue-resource'

import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import ElementUI from 'element-ui'
import '../theme/index.css'

import router from './config/routers'
import store from './store'

Vue.use(ElementUI)
Vue.use(VueResource)

Vue.http.options.root = 'api/v1'

const app = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
