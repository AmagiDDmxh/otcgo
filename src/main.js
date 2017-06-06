import 'bootstrap/dist/css/bootstrap.css'
import '../theme/index.css'
import '~styles/common.styl'
import 'moment'

import Vue from 'vue'
import _ from 'lodash'
import VueResource from 'vue-resource'
import Vuelidate from 'vuelidate'
import Icon from 'vue-awesome'
import moment from 'moment'
require('moment/locale/zh-cn')

import App from './App.vue'
import router from './routers'
import store from './store'

import ElementUI from 'element-ui'
import VueSVGIcon from 'vue-svgicon'

Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(VueSVGIcon)
Vue.use(Vuelidate)
Vue.use(require('vue-moment'), { moment })

// Define lodash, make it use as this.$_ instead of globally
Object.defineProperty(Vue.prototype, '$_', { value: _ })
Object.defineProperty(Vue.prototype, '$mo', { value: moment })

Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.http.options.root = '/api/v1'
Vue.http.options.emulateJSON = true

Vue.component('icon', Icon)

const app = new Vue({
  el: '#app',
  router,
  store,
  render: r => r(App)
})

app.$notify.warning({
  title: '警告',
  message: '请下载最新版谷歌浏览器，以便无法使用全部功能。',
  duration: 0
})
