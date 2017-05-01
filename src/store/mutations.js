import Vue from 'vue'
import type from './mutation_type'

/**
 * Created by Administrator on 4/24/2017.
 */

export default {
  [type.setAsset](state, balances) {
    state.balances = balances
    state.loggedIn = true
  },
  [type.setUID](state, uid) {
    Vue.set(state.wa, 'uid', uid)
  },
  [type.setWallet](state, wa) {
    state.wa = wa
  },
  [type.setReceive](state, name) {
    state.receive = state.balances.find(i => i.name === name)
  },
  [type.setDeliver](state, name) {
    state.deliver = state.balances.find(i => i.name === name)
  },
  [type.downloadWallet](state) {
    const { publicKeyCompressed, publicKey, privateKeyEncrypted, address } = state.wa
    const text = JSON.stringify({
      publicKeyCompressed, publicKey, privateKeyEncrypted, address
    })

    const file = new window.Blob([text], { type: 'text/plan' })

    const aLink = document.createElement('a')
    aLink.href = window.URL.createObjectURL(file)
    aLink.download = state.fileName
    aLink.click()
  },
  [type.setFileName](state, fileName) {
    state.fileName = fileName
  }
}
