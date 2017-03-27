import types from './mutation_types'

const mutations = {
  [types.SET_FIELD](state, { name, field }) {
    state.wa = name ?
        {...state.wa, ...{ name: field} } :
        {...state.wa, ...field}
  },

  [types.RESET](state) {
    state.wa = {};
  },

  [types.SET_UID](state, u) {
    state.wa['u'] = u;
  },

  [types.SET_Pp](state, Pp) {
    state.wa['pk y'] = Pp;
  }
}

export default mutations