import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

/**
 * A useful helper function, return the response.json() object
 *
 * @param [endPoint] Required:string
 * @param [data] :object declare like {
 *   [params] ?:object | for query
 *   [body] ?: object | for post
 *   ...
 * }
 * @param [method] :string
 * @RESPONSE { * :any } :object | Promise[pending]
 *
 * @example fetching(endPoint :string, data ?:object={}, method ?:string="get")
 * @return Promise[pending]
 *
 * @example await fetching(endPoint :string, data ?:object={}, method ?:string="get")
 * @return data: { * :any } :object
 */
const fetching = async (endPoint, data={}, method="get") => {
  const response = await Vue.http[method](endPoint, data)
  return await response.json()
}

/**
 * @GET '/api/v1/nonce/'
 * @RESPONSE { nonce :string } :object
 *
 * @return RESPONSE.nonce :string
 */
export const getN = async () => (await fetching('nonce/')).nonce

const sign = data => fetching('sign/', data, 'post')
const signatureRedeem = async data => fetching('signature/redeem/', data, 'post')

export const getB = async add => (await fetching(`balances/${add}/`))
export const getU = async add => (await fetching(`uid/${add}`))

export const getC = async publicKeyCompressed => (await fetching(`conversion/${publicKeyCompressed}`)).address

export const getH = async (name, add, params) => {
  if (name === 'redeem') return await fetching(`redeem/${add}`, { params })
  if (name === 'transfer') return await fetching(`balances/transfer/history/${add}`, { params })
  throw new Error('No name accepted')
}

export const getM = async name => {
  const markets = await fetching(`order_book/${name}`)
  return markets['asks'].reduce(
      (acc, item) => acc.concat({
        id: item.id,
        price: item.price,
        amount: item.amount,
        total: item.price * item.amount
      }),
      []
  )
}
export const getO = async add => await fetching(`order/${add}`)

// Checkout the cart by POST to the bids
export const bid = async (bids, pr) => {
  const bidJson = await fetching('bid/', bids, 'post')

  return sign({
    id: bidJson.order['id'],
    signature: ljSign(pr, bidJson['transaction']),
    nonce: await getN()
  })
}

export const ask = async (asks, pr) => {
  const askJson = await fetching('ask/', asks, 'post')
  return sign({
    nonce: await getN(),
    id: askJson.order['id'],
    signature: ljSign(pr, askJson['transaction'])
  })
}

export const redeem = async (id, pr, address) => {
  const nonce = await getN()

  const redeemJson = await fetching('redeem/', {
    nonce, id, address,
    signature: ljSign(pr, nonce)
  }, 'post')

  return signatureRedeem({
    id: redeemJson['id'],
    signature: ljSign(pr, redeemJson['transaction'])
  })
}


export const transfer = async (body, pr) => {
  const nonce = await getN()
  const transferJson = await fetching('balances/transfer/', body, 'post')

  const data = {
    id: transferJson['id'],
    signature: ljSign(pr, transferJson['transaction']),
    nonce
  }
  return sign(data)
}

export const cancel = async (id, pr) => {
  const nonce = await getN()
  const data = {
    id,
    nonce,
    signature: ljSign(pr, nonce)
  }
  const cancelJson = await fetching('cancel/', data, 'post')
  data.signature = await ljSign(pr, cancelJson.transaction)

  return sign(await data)
}

export default {
  getC, getO, getH, getB, getM, getU, redeem, transfer, cancel, ask, bid
}

/**
 * Created by Administrator on 4/19/2017.
 */
