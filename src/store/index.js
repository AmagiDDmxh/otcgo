import Vue from 'vue'
import Vuex from 'vuex'
import config from '../utils/config'

import service from '../api'

Vue.use(Vuex)

/**
 * Created by Administrator on 4/19/2017.
 */

export const type = {
  setAsset: 'SET_ASSET',
  getUID: 'GET_UID',
  checkout: 'CHECKOUT'
}

const state = {
  asset : {},
  loggedIn: !!window.LJWallet,
  uid: null
}

const actions = {
  [type.setAsset] ({ commit, state, dispatch }) {
    let add = window.LJWallet['address']
    service.getB(add).then(({ data: { balances } }) => {
      commit(type.setAsset, balances)
      dispatch(type.getUID, add)
    })
  },
  [type.checkout]({ commit }, { id, hex_pubkey }) {
    return service.checkout(id, hex_pubkey)
  },

  [type.getUID]({ state }, add) {
    return service.getU(add).then(({data: {uid}}) => {
      state.loggedIn = true
      state.uid = uid
    })
  },
}


const mutations = {
  [type.setAsset](state, balances) {
    state.asset = {
      rmbAsset: balances.find(i => i.name === '人民币'),
      ancAsset: balances.find(i => i.name === '小蚁币'),
      ansAsset: balances.find(i => i.name === '小蚁股'),
      cmsAsset: balances.find(i => i.name === '开拍学园')
    }
  }
}

const getters = {
  asset: state => state['asset'],
  cart: state => state['added'],
  loggedIn: state => state['loggedIn'],
  uid: state => state['uid']
}


export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  strict: config.debug
})