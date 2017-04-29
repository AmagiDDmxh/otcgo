import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

export let getB = add => Vue.http.get(`balances/${add}`)
export let getU = add => Vue.http.get(`uid/${add}`)

// Checkout the cart by POST to the bids
export let bids = (id, hex_pubkey) => Vue.http.post('bid/', { id, hex_pubkey })
  .then(({ data }) => ({ id: data.order['id'], transaction: data['transaction'] }))
  .then(signature).then(data => getNonce().then(nonce => data.nonce = nonce).then(sign))

export let redeem = id => Vue.http.post('redeem/', {
  nonce: 'aaaaaaaa',
  signature: ljSign(window.LJWallet['privateKey'], 'aaaaaaaa'),
  id,
  address: window.LJWallet['address']
}).then(({ data }) => ({id: data['id'], transaction: data['transaction']})).then(signature).then(signatureRedeem)

let signature = ({id, transaction}) => ({
  signature: ljSign(window.LJWallet['privateKey'], transaction),
  id
})

let getNonce = Vue.http.get('nonce/').then(({data: {nonce} }) => ({nonce}))

let sign = data => Vue.http.post('sign/', data)

let signatureRedeem = data => Vue.http.post('signature/redeem/', data)

export default {
  getB, getU, bids, redeem
}

/**
 * Created by Administrator on 4/19/2017.
 */
