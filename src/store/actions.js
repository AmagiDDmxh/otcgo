import type from './mutation_type'
import service from '../api'

/**
 * Created by Administrator on 4/24/2017.
 */

export default {
  [type.login]({ commit, dispatch }, wa) {
    commit(type.setWallet, wa)
    commit(type.login)
    return dispatch(type.getUID, wa)
  },

  [type.logout]({ commit }) {
    commit(type.logout)
  },

  async [type.signUp]({ commit }, { publicKeyCompressed, publicKey, privateKeyEncrypted, privateKey }) {
    commit(type.setWallet, { publicKeyCompressed, publicKey, privateKeyEncrypted, privateKey, address: service.getC(publicKeyCompressed) })
    commit(type.downloadWallet)
    commit(type.signUp)
    return Promise.resolve(true)
  },

  async [type.getAsset] ({ commit, state }) {
    commit(type.setAsset, (await service.getB(state.wa['address'])).balances)
  },

  async [type.getUID] ({ commit, state }, _) {
    commit(type.setUID, (await service.getU(state.wa['address'])).uid)
    commit(type.setWif, service.getW(state.wa['privateKey']))
  },

  [type.getMarkets]({}, name) {
    return service.getM(name)
  },

  [type.getHistory]({ state }, { name, params }) {
    return service.getH(name, state.wa['address'], params)
  },

  [type.getOrder]({ state }) {
    return service.getO(state.wa['address'])
  },

  [type.bid]({ state }, { id }) {
    return service.bid({ id, hexPubkey: state.wa['publicKey'] }, state.wa['privateKey'])
  },

  [type.redeem]({ state }, { id }) {
    return service.redeem(id, state.wa['privateKey'], state.wa['address'])
  },

  [type.ask]({ state, dispatch }, { amount, price }) {
    const deliver = state['deliver']
    const receive = state['receive']

    return service.ask({
      amount,
      price,
      assetid: deliver.asset,
      valueid: receive.asset,
      hexPubkey: state.wa['publicKey']
    },
        state.wa['privateKey'])
  },

  async [type.transfer]({ dispatch, state }, { dest, amount, assetid }) {
    try {
      return await service.transfer({
        dest,
        amount,
        assetid,
        source: state.wa['address'],
        hexPubkey: state.wa['publicKey']
      }, state.wa['privateKey']
    )} catch (e) {
      return Promise.reject(e)
    }
  },

  [type.cancel]({ state }, { id }) {
    return service.cancel(id, state.wa['privateKey'])
  }
}
