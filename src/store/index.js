import Vue from 'vue'
import Vuex from 'vuex'
import config from '../utils/config'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

/**
 * Created by Amagi on 4/19/2017.
 */


// TODO: 1. When the user login, we wanna check the wallet.json file
//     1. if not json file, throw error
//     2. else check take the value from the file
//         1. then waiting for the passwd input
//         2. translate to wallet['privateKey']
//  2. Wallet COMPLETED, and try to get the uid by using wallet['address']
    // The header check out the logged, then show up the uid
    // The markets need to checkout the wallet valid value

const state = {
  assets: {},
  loggedIn: !!this.wa,
  wa: {}
}


export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  strict: config.debug
})