import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)



const getNonce = () => Vue.http.get('nonce/').then(({ data: { nonce }}) => nonce)
const sign = data => Vue.http.post('sign/', data)
const signatureRedeem = data => Vue.http.post('signature/redeem/', data)

export const getB = add => Vue.http.get(`balances/${add}`).then(({ data: { balances }}) => balances)
export const getU = add => Vue.http.get(`uid/${add}`).then(({ data: { uid }}) => uid)

export const getC = publicKeyCompressed => Vue.http.get(`conversion/${publicKeyCompressed}`).then(({ data: { address }}) => address)

export const getH = async (name, add, params) => {
  if (name === 'redeem') {
    const redeem = await Vue.http.get(`redeem/${add}`, {
      params
    })
    return await redeem.json()
  }
  if (name === 'transfer') {
    const transfer = await Vue.http.get(`balances/transfer/history/${add}`, {
      params
    })
    return await transfer.json()
  }
}
export const getM = async name => {
  const markets = await Vue.http.get(`order_book/${name}/`)
  const marketsJSON = await markets.json()
  return marketsJSON['asks'].reduce(
      (acc, item) => acc.concat({
        id: item.id,
        price: item.price,
        amount: item.amount,
        total: item.price * item.amount
      }),
      []
  )
}
export const getO = async add => {
  const order = await Vue.http.get(`order/${add}`)
  return await order.json()
}

// Checkout the cart by POST to the bids
export const bid = async (bids, pr) => {
  const bid = await Vue.http.post('bid/', bids)
  const bidJson = await bid.json()

  return sign({
    id: bidJson.order['id'],
    signature: ljSign(pr, bidJson['transaction']),
    nonce: await getNonce()
  })
}

export const ask = async (asks, pr) => {
  const ask = await Vue.http.post('ask/', asks)
  const askJson = await ask.json()

  return sign({
    nonce: await getNonce(),
    id: askJson.order['id'],
    signature: ljSign(pr, askJson['transaction'])
  })
}

export const redeem = async (id, pr, address) => {
  console.log(id)
  const nonce = await getNonce()

  const redeem = await Vue.http.post('redeem/', {
    nonce, id, address,
    signature: ljSign(pr, nonce)
  })

  const redeemJson = await redeem.json()

  return signatureRedeem({
    id: redeemJson['id'],
    signature: ljSign(pr, redeemJson['transaction'])
  })
}


export const transfer = async (body, pr) => {
  const nonce = await getNonce()
  const transfer = await Vue.http.post('balances/transfer/', body)
  const transferJson = await transfer.json()

  const data = {
    id: transferJson['id'],
    signature: ljSign(pr, transferJson['transaction']),
    nonce
  }
  return sign(data)
}

export const cancel = async (id, pr) => {
  const nonce = await getNonce()
  const data = {
    id,
    nonce,
    signature: ljSign(pr, nonce)
  }
  const cancel = await Vue.http.post('cancel/', data)
  const cancelJson = await cancel.json()
  data.signature = await ljSign(pr, cancelJson.transaction)

  return sign(await data)
}

export default {
  getC, getO, getH, getB, getM, getU, redeem, transfer, cancel, ask, bid,
}

/**
 * Created by Administrator on 4/19/2017.
 */
