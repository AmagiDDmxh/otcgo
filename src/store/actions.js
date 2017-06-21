import type from './mutation_type'
import service from '../api'

/**
 * Created by Administrator on 4/24/2017.
 */

export default {
  [type.login]({ commit, dispatch }, wa) {
    commit(type.setWallet, wa)
    commit(type.login)
    return dispatch(type.getUID)
  },

  [type.logout]({ commit }) {
    commit(type.logout)
  },

  async [type.signUp]({ commit }, { publicKeyCompressed, publicKey, privateKeyEncrypted, privateKey }) {
    commit(type.setWalletTemporary, { publicKeyCompressed, publicKey, privateKeyEncrypted, privateKey, address: service.getC(publicKeyCompressed) })
    commit(type.downloadWallet)
    commit(type.signUp)
    return Promise.resolve(true)
  },

  async [type.getAsset] ({ commit, state }) {
    commit(type.setAsset, (await service.getA(state.wa['address'])).balances)
  },

  async [type.getUID] ({ commit, state }, _) {
    commit(type.setUID, (await service.getU(state.wa.address)).uid)
    commit(type.setWif, service.getW(state.wa.privateKey))
  },

  [type.getMarkets]({}, { name, params}) {
    return service.getM(name, params)
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

  [type.ask]({ state }, { amount, price }) {
    const deliver = state['deliver']
    const receive = state['receive']

    return service.ask({
      amount,
      price,
      assetId: deliver.assetId,
      valueId: receive.assetId,
      hexPubkey: state.wa['publicKey']
    }, state.wa['privateKey'])
  },

  async [type.transfer]({ state }, { dest, amount, assetId }) {
    try {
      return await service.transfer({
        dest,
        source: state.wa['address'],
        amount,
        assetId,
        hexPubkey: state.wa['publicKey']
      }, state.wa['privateKey'])
    } catch (e) {
      return Promise.reject(e)
    }
  },

  [type.cancel]({ state }, { id }) {
    return service.cancel(id, state.wa['privateKey'])
  },

  async [type.getBlock]({ commit }) {
    commit(type.setBlock, (await service.getB()))
  },

  [type.getICO](_, id) {
    return service.getI(id)
  },

  [type.bidICO]({ state }, { id, shares, password }) {
    return service.bidICO({
      id,
      shares,
      password,
      hexPubkey: state.wa['publicKey']
    }, state.wa['privateKey'])
  },

  [type.askICO]({ state }, { id, adminAddress }) {
    const add = state.wa['address']
    if (add !== adminAddress) return Promise.reject('The address is completely invalid!')

    return service.askICO({ id, hexPubkey: state.wa['publicKey'] }, state.wa['privateKey'])
  },

  [type.getIO]: ({ state }) => service.getIO(state.wa['address']),

  [type.getMarketsById]: ({ state }, marketId) => service.getMarketsById(marketId),

  [type.sendAsk]: ({ state }, payload) => service.sendAsk(Object.assign(payload, {
    hexPubkey: state.wa['publicKey']
  }), state.wa['privateKey']),

  [type.sendBid]: ({ state }, payload) => service.sendBid(Object.assign(payload, {
    hexPubkey: state.wa['publicKey']
  }), state.wa['privateKey']),

  [type.sendFreeAsk]: ({ state }, payload) => service.sendFreeAsk(Object.assign(payload, {
    hexPubkey: state.wa['publicKey']
  }), state.wa['privateKey']),

  [type.sendFreeBid]: ({ state }, payload) => service.sendFreeBid(Object.assign(payload, {
    hexPubkey: state.wa['publicKey']
  }), state.wa['privateKey']),

  [type.getPriceById]: ({ state }, marketId) => service.getPriceById(marketId),

  [type.getRedeem]: ({ state }) => service.getRedeem(state['wa'].address),

  [type.getOrderByAddress]: ({ state }) => service.getOrderByAddress(state['wa'].address),

  [type.getHistoryById]: ({ state }, { marketId, active, length }) => service.getHistoryById({ marketId, active, length }),

  [type.getMyHistoryById]: ({ state }, { marketId, active, length }) => service.getMyHistoryById(Object.assign({ marketId, active, length }, {
    address: state.wa['address']
  }))
}
