import login from '../pages/login.vue'
import betaHome from '../pages/betaHome.vue'
import creatWallet from '../pages/creatWallet.vue'
import wallet from '../pages/wallet.vue'
import admin from '../pages/admin.vue'
import balances from '../pages/subpage/balances.vue';
import uid from '../pages/subpage/uid.vue';


const routes = [{
    path: '/betaHome',
    component: betaHome
}, {
    path: '/login',
    component: login
}, {
    path: '/',
    component: betaHome
}, {
    path: '/admin',
    component: admin,
    children: [{
        path: "uid",
        component: uid,
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({path: '/betaHome'});
                return;
            };
            next();
        }
    }, {
        path: "balances",
        component: balances,
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({path: '/betaHome'});
                return;
            }
            ;
            next();
        }

    }, {
        path: "",
        component: balances,
        beforeEnter: (to, from, next) => {
            if (!window.LJWallet) {
                next({path: '/login'})
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
}]



export { routes };
