import Vue from 'vue'
import type from './mutation_type'

/**
 * Created by Administrator on 4/24/2017.
 */

export default {
  [type.logout](state) {
    console.log('[LOGOUT] Call')
    state.balances = []
    state.wa = {}
    state.loggedIn = false
    state.receive = {}
    state.deliver = {}
    state.fileName = ''
  },
  [type.setAsset](state, balances) {
    state.balances = balances
  },
  [type.setUID](state, uid) {
    Vue.set(state.wa, 'uid', uid)
  },
  [type.setWallet](state, wa) {
    state.wa = wa
    state.loggedIn = true
  },

  // TODO: Might wanna change the func like a find field in a specific, not just by the name
  [type.setReceive](state, name) {
    state.receive = state.balances.find(i => i.name === name)
  },
  [type.setDeliver](state, name) {
    state.deliver = state.balances.find(i => i.name === name)
  },
  [type.downloadWallet](state) {
    const { publicKeyCompressed, publicKey, privateKeyEncrypted, address } = state.wa
    const text = JSON.stringify({
      address, publicKey, publicKeyCompressed, privateKeyEncrypted
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
