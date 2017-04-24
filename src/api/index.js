import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

// GET the balances
export let getB = add => Vue.http.get(`balances/${add}`)
// GET the UID
export let getU = add => Vue.http.get(`uid/${add}`)
// Checkout the cart by POST to the bids
export let checkout = (id, hex_pubkey) => Vue.http.post('bid/', { id, hex_pubkey }).then(({data: {transaction} }) => ({id, transaction})).then(signature)

let signature = ({id, transaction}) => Vue.http.get('nonce/').then(({data: {nonce} }) => ({
  signature: ljSign(window.LJWallet['privateKey'], transaction),
  nonce,
  id
})).then(sign)

let sign = data => Vue.http.post('sign/', data)

export default {
  getB, getU, checkout
}

/**
 * Created by Administrator on 4/19/2017.
 */
