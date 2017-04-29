import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/index',  //主页
    component: r => require(['./pages/home.vue'], r),
  }, {
    path: '/login',  //登陆
    component: r => require(['./pages/login/index.vue'], r),
  }, {
    path: '/',  //地址为空跳转Home页面
    component: r => require(['./pages/home.vue'], r),
  }, {
    path: '/admin',  //钱包
    component: r => require(['./pages/admin/index.vue'], r),
    children: [
      {
        path: 'uid',
        component: r => require(['./pages/admin/uid/uid.vue'], r),
      }, {
        path: 'redeem',
        component: r => require(['./pages/admin/redeem/redeem.vue'], r)
      }, {
        path: 'balances',
        component: r => require(['./pages/admin/balances/balances.vue'], r)
      }, {
        path: 'order',
        component: r => require(['./pages/admin/order/order.vue'], r)
      }, {
        path: 'history/transfer',
        component: r => require(['./pages/admin/history/transfer.vue'], r)
      }, {
        path: 'history/transaction',
        component: r => require(['./pages/admin/history/transaction.vue'], r)
      }
      , {
        path: '',
        component: r => require(['./pages/admin/balances/balances.vue'], r),
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
