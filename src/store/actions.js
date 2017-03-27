import types from './mutation_types'
import {
  transfer as trans,
  getUid as getU,
  getBalances as getB,
  getHistory as getH,
  getLogin as getL,
} from '../services/service'

export const reset = ({ commit }) => commit(types.RESET)
export const login = ({ state, commit }, pwd) => getL(state, commit, pwd).then(p => commit(types.SET_Pp, p))
export const getHistory = ({ state, commit }) => getH(state.wa)
export const getBalances = ({ state, commit }) => getB(state.wa)
export const getUid = ({ state, commit }) => getU(state.wa).then(p => commit(types.SET_UID, p))
export const transfer = ({ state, commit }, {
                           assetId,
                           transfer_num,
                           transfer_address_value,
                         }) => trans(state, {
  assetId,
  transfer_num,
  transfer_address_value,
})

export const setField = ({ commit }, { name, field }) => {
  if (name) {
    commit(types.SET_FIELD, { name, field })
  }
  else {
    commit(types.SET_FIELD, { field })
  }
}

export default {
  setField,
  reset,
  login,
  getBalances,
  getHistory,
  getUid,
  transfer,
}