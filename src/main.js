import 'bootstrap/dist/css/bootstrap.css'
import 'element-ui/lib/theme-default/index.css'
import '~assets/styles/common.styl'

import Vue from 'vue'
import App from './App.vue'
import router from './routers'
import store from './store'
import VueResource from 'vue-resource'

import Vuelidate from 'vuelidate'
import ElementUI from 'element-ui'



Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(Vuelidate)

Vue.http.options.root = '/api/v1'
Vue.http.options.emulateJSON = true

router.beforeEach((to, from, next) => {
  if (to.path === '/login' && from.path === '/markets') {
    next(vm => {
      if (vm.$store.getters['loggedIn']) {
        next({ path: '/markets' })
        return
      }
      next()
    })
    return
  }
  next()
})


new Vue({
  el: '#app',
  router,
  store,
  render: r => r(App)
})
