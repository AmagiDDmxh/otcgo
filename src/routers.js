import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 主页
  { path: '/index', component: r => require(['~pages/home/home.vue'], r) },

  // 登陆
  { path: '/login', name: 'login', component: r => require(['~pages/login/index.vue'], r) },

  // 地址为空跳转Home页面
  { path: '/', component: r => require(['~pages/home/home.vue'], r) },

  // 钱包
  { path: '/admin', component: r => require(['~pages/admin/index.vue'], r),
    children: [
      { path: 'uid', component: r => require(['~pages/admin/uid/uid.vue'], r) },
      { path: 'redeem', component: r => require(['~pages/admin/redeem/redeem.vue'], r) },
      { path: 'balances', component: r => require(['~pages/admin/balances/balances.vue'], r) },
      { path: 'history/transfer', component: r => require(['~pages/admin/history/transfer.vue'], r), name: 'transferH' },
      { path: 'history/transaction', component: r => require(['~pages/admin/history/transaction.vue'], r), name: 'transactionH' },
      { path: 'order/:type', component: r => require(['~pages/admin/order'], r), name: 'order' },
      { path: '', component: r => require(['~pages/admin/balances/balances.vue'], r) }
    ]
  },

  // 创建钱包页面
  { path: '/signUp', component: r => require(['~pages/signUp/signUp.vue'], r) },
  { path: '/signUpNext', component: r => require(['~pages/signUp/signUpNext.vue'], r) },

  // 集市
  { path: '/markets', component: r => require(['~pages/markets/markets.vue'], r) },

  // 众筹状态
  { path: '/ico/status', component: r => require(['~pages/ico/status.vue'], r) },

  // 了解我们
  { path: '/about', component: r => require(['~pages/about'], r),
    children: [
      { path: 'details', component: r => require(['~pages/about/details'], r) },
      { path: 'plans', component: r => require(['~pages/about/plans'], r) },
      { path: 'medias', component: r => require(['~pages/about/medias'], r) },
      { path: '', component: r => require(['~pages/about/details'], r) }
    ]
  },

  // 用户协议与服务条款
  { path: '/protocol', component: r => require(['~pages/protocol/index.vue'], r) },

  // 用于测试
  // { path: '/test', component: r => require(['~pages/test/index.vue') },

  // 如果不存在，重定向于Home
  { path: '*', redirect: { path: '/index' }}
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
})

// mouted router
window.$router = router

export default router
