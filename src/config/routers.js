import login from '../pages/login.vue'
import betaHome from '../pages/betaHome.vue'
import createWallet from '../pages/createWallet.vue'
import wallet from '../pages/wallet.vue'
import admin from '../pages/admin.vue'
import balances from '../pages/admin/balances.vue';
import uid from '../pages/admin/uid.vue';
import history from '../pages/admin/history.vue';


const routes = [
    { path: '/betaHome', component: betaHome },

    { path: '/login', component: login },

    { path: '/', component: betaHome },

    { path: '/admin', component: admin,
      children: [
          { path: "history", component: history,
            beforeEnter: (to, from, next) => {
              if (!window.LJWallet) {
                  next({path: '/betaHome'});
                  return;
              }
              next();
          }
    },

    { path: "uid", component: uid,
      beforeEnter: (to, from, next) => {
          if (!window.LJWallet) {
              next({path: '/betaHome'});
              return;
          }
	      next();
      }
    },

    { path: "balances", component: balances,
      beforeEnter: (to, from, next) => {
          if (!window.LJWallet) {
              next({path: '/betaHome'});
              return;
          }
          next();
      }
    },

    { path: "", component: balances,
      beforeEnter: (to, from, next) => {
          if (!window.LJWallet) {
              next({path: '/login'})
              return;
          }
          next();
      }
    }
    ]},

    { path: '/createWallet', component: createWallet },
    { path: '/wallet', component: wallet }
];



export { routes };
