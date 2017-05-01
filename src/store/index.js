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

// const debug = process.env.NODE_ENV !== 'production'
const debug = false

const state = {
  balances: [],
  wa: debug ? {address:"ANXwnGms3HsCasDRVJkHTSkDodKVkHZ1bx",
    privateKey:"cc44863ec983780912d7f7b94b1a67b604c6e621bfae678720954537736755b0",
    privateKeyEncrypted:"U2FsdGVkX19ZyvUWsssHu+97kFtiuqjP0uyWqFYfk+PHthSllrGSHBfZfubclMgRSPaHZs0P036+lvUZPT8TG5vVrN6SHUdLRjRcboduCu1HR8oF/Btfq2eheAF6k9ou",
    publicKey:"04f5330ebf04f3865ee29d03659afef296c74312f4208d4459f7ecb3d8111b69b0755cdb216dad78d3472e8ee7c49e147301acc66e036508b5210668d62625719b",
    publicKeyCompressed:"03f5330ebf04f3865ee29d03659afef296c74312f4208d4459f7ecb3d8111b69b0"} : {},
  loggedIn: debug,
  receive: {},
  deliver: {},
  fileName: ''
}


export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  strict: config.debug
})