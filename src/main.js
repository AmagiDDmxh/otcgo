import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import 'bootstrap/dist/css/bootstrap.css'
import 'element-ui/lib/theme-default/index.css'
import router from './routers'

import ElementUI from 'element-ui'

Vue.use(ElementUI)
Vue.use(VueResource)

Vue.http.options.root = '/api/v1'
Vue.http.options.emulateJSON = true

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
