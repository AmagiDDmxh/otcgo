import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  { path: '/home', component: require('../pages/home.vue'), name: 'home' },
  { path: '/login', component: require('../pages/login/login.vue') },
  {
    path: '/admin', component: require('../pages/admin/admin.vue'),
    children: [
      { path: 'balances',
        component: require('../pages/admin/children/balances/balances.vue'),
        beforeEach: (to, form, next) => {
          store.getters.HAS ? next({ path: '/home' }) : next()
        }
      },
      { path: 'history',
        component: require('../pages/admin/children/history/history.vue'),
        beforeEach: (to, form, next) => {
          store.getters.HAS ? next({ path: '/home' }) : next()
        }
      },
      { path: 'uid',
        component: require('../pages/admin/children/uid.vue'),
        beforeEach: (to, form, next) => {
          store.getters.HAS ? next({ path: '/home' }) : next()
        }
      },
      { path: '',
        component: require('../pages/admin/children/balances/balances.vue'),
        beforeEach: (to, form, next) => {
          store.getters.HAS ? next({ path: '/home' }) : next()
        }
      },
    ],
  },
  { path: '/createWallet', component: require('../pages/signup/signup.vue') },
  { path: '/wa', component: require('../pages/signup/signup_two.vue') },
  { path: '*', component: require('../pages/home.vue'), name: 'home' },
]

export default new VueRouter({
  routes
})