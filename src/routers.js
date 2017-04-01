import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// This page is been canceled;
import obligation from './pages/admin/obligation/obligation.vue';

const routes = [{
    path: '/home',
    component: require('./pages/home.vue')
}, {
    path: '/login',
    component: require('./pages/login/login.vue')
}, {
    path: '/',
    component: require('./pages/home.vue')
}, {
    path: '/admin',
    component: require('./pages/admin/admin.vue'),
    children: [{
        path: "uid",
        component: require('./pages/admin/uid/uid.vue'),
        beforeEnter: (to, from, next) => {
            console.log(to, from, next);
            console.dir(to, from, next);
            if (!window.LJWallet) {
                next({path: '/login'});
                return;
            };
            next();
        }
    }, {
        path: "redeem",
        component: require('./pages/admin/redeem/redeem.vue'),
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({path: '/login'});
                return;
            }
            next();
        }
    }, {
        path: "balances",
        component: require('./pages/admin/balances/balances.vue'),
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({path: '/login'});
                return;
            }
            next();
        }

    }, {
        path: "order",
        component: require('./pages/admin/order/order.vue'),
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({path: '/login'});
                return;
            }
            next();
        }
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
        path: "",
        component: require('./pages/admin/balances/balances.vue'),
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({ path: '/login' })
                return;
            }
            next();
        }
    }]
}, {
    path: '/creatWallet',
    component: require('./pages/creatWallet/creatWallet.vue')
}, {
    path: '/wallet',
    component: require('./pages/creatWallet/wallet.vue')
}, {
    path: '/markets',
    component: require('./pages/markets/markets.vue')
}]

export default new VueRouter({
  routes
})
