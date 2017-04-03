import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// This page is been canceled;
import obligation from './pages/admin/obligation/obligation.vue'

const routes = [
  {
    path: '/index',
    component: r => require(['./pages/home.vue'], r),
  }, {
    path: '/login',
    component: r => require(['./pages/login/login.vue'], r),
  }, {
    path: '/',
    component: r => require(['./pages/home.vue'], r),
  }, {
    path: '/admin',
    component: r => require(['./pages/admin/admin.vue'], r),
    children: [
      {
        path: 'uid',
        component: r => require(['./pages/admin/uid/uid.vue'], r),
        beforeEnter: (to, from, next) => {
          console.log(to, from, next)
          console.dir(to, from, next)
          if (!window.LJWallet) {
            next({path: '/login'})
            return
          }

          next()
        },
      }, {
        path: 'redeem',
        component: r => require(['./pages/admin/redeem/redeem.vue'], r),
        beforeEnter: (to, from, next) => {
          if (!window.LJWallet) {
            next({path: '/login'})
            return
          }
          next()
        },
      }, {
        path: 'balances',
        component: r => require(['./pages/admin/balances/balances.vue'], r),
        beforeEnter: (to, from, next) => {
          if (!window.LJWallet) {
            next({path: '/login'})
            return
          }
          next()
        },

      }, {
        path: 'order',
        component: r => require(['./pages/admin/order/order.vue'], r),
        beforeEnter: (to, from, next) => {
          if (!window.LJWallet) {
            next({path: '/login'})
            return
          }
          next()
        },
      }, /*{
       path: "obligation",
       component: obligation,
       beforeEnter: (to, from, next) => {
       if (!window.LJWallet) {
       next({ path: '/login' })
       return;
       };
       next();
       }
       }, */{
        path: '',
        component: r => require(['./pages/admin/balances/balances.vue'], r),
        beforeEnter: (to, from, next) => {
          if (!window.LJWallet) {
            next({path: '/login'})
            return
          }
          next()
        },
      },
    ],
  }, {
    path: '/creatWallet',
    component: r => require(['./pages/creatWallet/creatWallet.vue'], r),
  }, {
    path: '/wallet',
    component: r => require(['./pages/creatWallet/wallet.vue'], r),
  }, {
    path: '/markets',
    component: r => require(['./pages/markets/markets.vue'], r),
  }, {
    path: '*',
    component: r => require(['./pages/home.vue'], r),
  },
]

export default new VueRouter({
  routes,
})
