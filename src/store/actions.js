import type from './mutation_type'
import service from '../api'

/**
 * Created by Administrator on 4/24/2017.
 */

export default {
  [type.login]({ commit }, wa) {
    service.getU(wa['address']).then(({data: {uid}}) => {
      commit(type.setWallet, wa)
      commit(type.setUID, uid)
    })
  },
  [type.getAsset] ({ commit }) {
    service.getB(wa['address']).then(({data: {balances}}) => {
      console.log(balances)
      // commit(type.setAsset, balances)
    })
  },
  [type.purchase](_, { id, hex_pubkey }) {
    return service.bids(id, hex_pubkey)
  },
  [type.redeem](_, id) {
    service.redeem(id)
  }
}