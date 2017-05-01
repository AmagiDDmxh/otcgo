import type from './mutation_type'
import service from '../api'

/**
 * Created by Administrator on 4/24/2017.
 */

export default {
  [type.login]({ commit, dispatch }, wa) {
    dispatch(type.getUID, wa['address']).then(() => commit(type.setWallet, wa))
  },

  async [type.signUp]({ commit }, { publicKeyCompressed, publicKey, privateKeyEncrypted, privateKey }) {
    commit(type.setWallet, { publicKeyCompressed, publicKey, privateKeyEncrypted, privateKey, address: await service.getC(publicKeyCompressed) })
    commit(type.downloadWallet)
    return Promise.resolve(true)
  },

  async [type.getAsset] ({ commit, state }) {
    commit(type.setAsset, await service.getB(state.wa['address']))
  },

  async [type.getUID] ({ commit }, add) {
    commit(type.setUID, await service.getU(add))
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
    return service.bid({ id, hex_pubkey: state.wa['publicKey'] }, state.wa['privateKey'])
  },

  [type.redeem]({ state }, { id }) {
    return service.redeem(id, state.wa['privateKey'], state.wa['address'])
  },

  [type.ask]({ state, dispatch }, { amount, price }) {
    const deliver = state['deliver']
    const receive = state['receive']

    return service.ask({
      amount: amount,
      price: price,
      assetid: deliver.asset,
      valueassetid: receive.asset,
      hex_pubkey: state.wa['publicKey']
    },
        state.wa['privateKey'])
  },

  async [type.transfer]({ dispatch, state }, { dest, amount, assetid }) {
    try {
      return await service.transfer({
        dest, amount, assetid,
        source: state.wa['address'],
        compressed_pubkey: state.wa['publicKeyCompressed'],
        hex_pubkey: state.wa['publicKey']
      }, state.wa['privateKey'])
    } catch (e) {
      return Promise.reject(e)
    }
  },

  [type.cancel]({ state }, { id }) {
    return service.cancel(id, state.wa['privateKey'])
  }
}