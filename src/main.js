import 'bootstrap/dist/css/bootstrap.css'
import '../theme/index.css'
import 'progressive-image/dist/index.css'
import '~styles/common.styl'

import Vue from 'vue'
import _ from 'lodash'
import VueResource from 'vue-resource'
import Vuelidate from 'vuelidate'
import Icon from 'vue-awesome'
import progressive from 'progressive-image/dist/vue'
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
Vue.use(progressive, {
  removePreview: true,
  scale: true
})

// Define lodash, make it use as this.$_ instead of globally
Object.defineProperty(Vue.prototype, '$_', { value: _ })
Object.defineProperty(Vue.prototype, '$mo', { value: moment })

Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.http.options.root = '/api/v1'
Vue.http.options.emulateJSON = true

Vue.component('icon', Icon)
Vue.component('Vuetable', require('vuetable-2/src/components/Vuetable.vue'))

const app = new Vue({
  el: '#app',
  router,
  store,
  render: r => r(App)
})

app.$notify.warning({
  title: '提示',
  message: '请使用最新版谷歌浏览器进行页面操作，否则可能导致部分功能无法正常使用。',
  offset: 100
})


