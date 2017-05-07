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


const state = {
  balances: [],
  wa: {},
  loggedIn: false,
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