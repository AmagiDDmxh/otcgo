import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import 'bootstrap/dist/css/bootstrap.css'
import Vuex from 'vuex'

import './assets/js/lj-js/aes'
import './assets/js/lj-js/jsrsasign-latest-all-min'
import './assets/js/lj-js/sha256'
import './assets/js/lj-js/Base58'
import './assets/js/lj-js/LJSign'

import '../theme/index.css'


import ElementUI from 'element-ui'

import { routes } from './config/routers'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Vuex)

const router = new VueRouter({ routes })

Vue.http.options.root = '/api/v1'
Vue.http.options.emulateJSON = true

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
