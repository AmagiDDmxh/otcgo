import login from '../pages/login.vue'
import home from '../pages/home.vue'
import creatWallet from '../pages/creatWallet.vue'
import wallet from '../pages/wallet.vue'
import markets from '../pages/markets.vue'

// This page is been canceled;
import obligation from '../pages/subpage/obligation.vue';

import admin from '../pages/admin.vue'
import balances from '../pages/subpage/balances.vue';
import redeem from '../pages/subpage/redeem.vue';
import order from '../pages/subpage/order.vue';
import uid from '../pages/subpage/uid.vue';


const routes = [{
    path: '/home',
    component: home
}, {
    path: '/login',
    component: login
}, {
    path: '/',
    component: home
}, {
    path: '/admin',
    component: admin,
    children: [{
        path: "uid",
        component: uid,
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({path: '/login'});
                return;
            };
            next();
        }
    }, {
        path: "redeem",
        component: redeem,
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({path: '/login'});
                return;
            }
            next();
        }
    }, {
        path: "balances",
        component: balances,
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({path: '/login'});
                return;
            }
            ;
            next();
        }

    }, {
        path: "order",
        component: order,
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({path: '/login'});
                return;
            };
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
        component: balances,
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({ path: '/login' })
                return;
            };
            next();
        }
    }]
}, {
    path: '/creatWallet',
    component: creatWallet
}, {
    path: '/wallet',
    component: wallet
}, {
    path: '/markets',
    component: markets
}]



export { routes };
