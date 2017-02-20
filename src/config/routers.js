import login from '../pages/login.vue'
import index from '../pages/index.vue'
import creatWallet from '../pages/creatWallet.vue'
import wallet from '../pages/wallet.vue'
import bazaar from '../pages/bazaar.vue'

import admin from '../pages/admin.vue'
import propertylist from '../pages/subpage/propertylist.vue';
import obligation from '../pages/subpage/obligation.vue';
import mybill from '../pages/subpage/mybill.vue';
import user from '../pages/subpage/user.vue';


const routes = [{
    path: '/index',
    component: index
}, {
    path: '/login',
    component: login
}, {
    path: '/',
    component: index
}, {
    path: '/admin',
    component: admin,
    children: [{
        path: "user",
        component: user,
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({ path: '/login' })
                return;
            };
            next();
        }
    }, {
        path: "propertylist",
        component: propertylist,
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({ path: '/login' })
                return;
            };
            next();
        }

    }, {
        path: "mybill",
        component: mybill,
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({ path: '/login' })
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
        component: propertylist,
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
    path: '/bazaar',
    component: bazaar
}]



export { routes };
