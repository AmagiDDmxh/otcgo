import type from './mutation_type'

/**
 * Created by Administrator on 4/24/2017.
 */


export default {
  [type.setAsset](state, balances) {
    state.asset = {
      // rmbAsset: balances.find(i => i.name === '人民币'),
      ancAsset: balances.find(i => i.name === '小蚁币'),
      ansAsset: balances.find(i => i.name === '小蚁股'),
      cmsAsset: balances.find(i => i.name === '开拍学园币（KAC）')
    }
  },
  [type.setUID](state, uid) {
    state.loggedIn = true
    state.wa['uid'] = uid
  },
  [type.setWallet](state, wa) {
    state.wa = wa
  }
}