import type from './mutation_type'
import service from '../api'

/**
 * Created by Administrator on 4/24/2017.
 */

export default {
  [type.login]({ commit, dispatch }, wa) {
    service.getU(wa['address']).then(({data: {uid}}) => {
      commit(type.setWallet, wa)
      commit(type.setUID, uid)
    })
  },
  [type.setAsset] ({ commit, dispatch }, { balances, add}) {
    commit(type.setAsset, balances)
    dispatch(type.getUID, add)
  },
  [type.purchase](_, { id, hex_pubkey }) {
    return service.bids(id, hex_pubkey)
  },
  [type.getUID]({ commit }, add) {

  },

  [type.redeem](_, id) {
    service.redeem(id)
  }
}