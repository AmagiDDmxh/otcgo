import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.css';
import 'element-ui/lib/theme-default/index.css';


import ElementUI from 'element-ui'

import { routes } from './config/routers'

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.use(VueResource)

const router = new VueRouter({ routes })

Vue.axios.defaults.baseURL = 'https://otcgo.cn/api/v1/';
Vue.axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
Vue.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
Vue.axios.defaults.headers.common['Access-Control-Allow-Headers'] = '*';

Vue.http.options.root = '/api/v1'
Vue.http.options.emulateJSON = true

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
