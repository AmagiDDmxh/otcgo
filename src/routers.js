import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 主页
  { path: '/index', component: r => require(['./pages/home.vue'], r) },

  // 登陆
  { path: '/login', component: r => require(['./pages/login/index.vue'], r) },

  // 地址为空跳转Home页面
  { path: '/', component: r => require(['./pages/home.vue'], r) },

  // 钱包
  { path: '/admin',
    component: r => require(['./pages/admin/index.vue'], r),
    children: [
      { path: 'uid', component: r => require(['./pages/admin/uid/uid.vue'], r) },
      { path: 'redeem', component: r => require(['./pages/admin/redeem/redeem.vue'], r) },
      { path: 'balances', component: r => require(['./pages/admin/balances/balances.vue'], r) },
      { path: 'order', component: r => require(['./pages/admin/order/order.vue'], r) },
      { path: 'history/transfer', component: r => require(['./pages/admin/history/transfer.vue'], r) },
      { path: 'history/transaction', component: r => require(['./pages/admin/history/transaction.vue'], r) },
      { path: '', component: r => require(['./pages/admin/balances/balances.vue'], r) }
    ]
  },

  // 创建钱包页面
  { path: '/signUp', component: r => require(['./pages/signUp/signUp.vue'], r) },
  { path: '/signUpNext', component: r => require(['./pages/signUp/signUpNext.vue'], r) },

  // 集市
  { path: '/markets',component: r => require(['./pages/markets/markets.vue'], r) },

  // 如果不存在，重定向于Home
  { path: '*', redirect: { path: '/index' } }
]

export default new VueRouter({
  routes
})
