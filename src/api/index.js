import Vue from 'vue'
import VueResource from 'vue-resource'
import Base58 from 'bs58'
import CryptoJS from 'crypto-js'

import { ljSign } from '~libs/LJSign'

Vue.use(VueResource)

const fetching = async (endPoint, data={}, method="get") => {
  const response = await Vue.http[method](`${endPoint}/`, data)
  return await response.json()
}

const getN = () => 'aaaaaaaa'

const sign = async data => await fetching('sign', data, 'post')

const signatureRedeem = async data => fetching('signature/redeem', data, 'post')

const getI = async id => (await fetching(`ico/${id}`))

export const getA = async add => (await fetching(`balances/${add}`))
export const getU = async add => (await fetching(`uid/${add}`))

export const getH = async (name, add, params) => {
  if (name === 'redeem') return await fetching(`redeem/${add}`, { params })
  if (name === 'transfer') return await fetching(`balances/transfer/history/${add}`, { params })
  throw new Error('No name accepted')
}

export const getB = async () => await fetching('block/count')

export const getM = async (name, params) => await fetching(`order_book/${name}`, { params })

export const getO = async add => await fetching(`order/${add}`)

export const getC = publicKeyCompressed => {
  const redeem = '21' + publicKeyCompressed + 'ac'
  const unhex = CryptoJS.enc.Hex.parse(redeem)
  const scriptHash = CryptoJS.enc.Hex.parse('17' + CryptoJS.RIPEMD160(CryptoJS.SHA256(unhex)).toString())
  const address = scriptHash + CryptoJS.SHA256(CryptoJS.SHA256(scriptHash)).toString().substring(0, 8)
  const bytes = Buffer.from(address, 'hex')
  return Base58.encode(bytes)
}

export const getW = pr => {
  let wif = `80${pr}01`
  const unhex = CryptoJS.enc.Hex.parse(wif)
  wif = `${wif}${CryptoJS.SHA256(CryptoJS.SHA256(unhex)).toString().substring(0, 8)}`

  const bytes = Buffer.from(wif, 'hex')
  return Base58.encode(bytes)
}

export const bid = async (bids, pr) => {
  const bidJson = await fetching('otc/bid', bids, 'post')

  return sign({
    id: bidJson.order['id'],
    signature: ljSign(pr, bidJson['transaction']),
    nonce: getN()
  })
}

export const ask = async (asks, pr) => {
  const askJson = await fetching('otc/ask', asks, 'post')
  return sign({
    nonce: getN(),
    id: askJson.order['id'],
    signature: ljSign(pr, askJson['transaction'])
  })
}

export const redeem = async (id, pr, address) => {
  const nonce = getN()

  const redeemJson = await fetching('redeem', {
    nonce, id, address,
    signature: ljSign(pr, nonce)
  }, 'post')

  return signatureRedeem({
    id: redeemJson['id'],
    signature: ljSign(pr, redeemJson['transaction'])
  })
}


export const transfer = async (body, pr) => {
  const nonce = getN()
  const transferJson = await fetching('balances/transfer', body, 'post')

  const data = {
    id: transferJson['id'],
    signature: ljSign(pr, transferJson['transaction']),
    nonce
  }
  return sign(data)
}

export const cancel = async (id, pr) => {
  const nonce = getN()
  const data = {
    id,
    nonce,
    signature: ljSign(pr, nonce)
  }
  const cancelJson = await fetching('cancel', data, 'post')
  data.signature = ljSign(pr, cancelJson.transaction)

  return sign(data)
}

const signICO = async data => await (fetching('ico/sign', data, 'post'))

export const bidICO = async ({ id, shares, hexPubkey, password }, pr) => {
  const { transaction, order } = await (fetching('ico/bid', { id, shares, hexPubkey, password }, 'post'))
  return signICO({
    id: order.id,
    signature: ljSign(pr, transaction)
  })
}

export const askICO = async ({ id, hexPubkey }, pr) => {
  const { transaction, order } = await (fetching('ico/ask', { id, hexPubkey }, 'post'))
  return signICO({
    id: order.id,
    signature: ljSign(pr, transaction)
  })
}

export const getIO = async add => (await fetching(`ico/order/${add}`))

/**
 * 获取随机字符串
 */

export const getNonce = async () => await (fetching(`nonce`))

/**
 * 获取所有市场详情
 */
export const getMarkets = async () => await (fetching('markets'))

/**
 * 获取单一市场的市场详情
 */

export const getMarketsById = async marketId => await (fetching(`markets/${marketId}`))

/**
 * 挂卖单
 */

export const sendAsk = async ({ assetId, valueId, price, amount, hexPubkey }, pr) => {
  const { transaction, order } = await (fetching('otc/ask', { assetId, valueId, price, amount, hexPubkey }, 'post'))
  return otcSign({
    id: order.id,
    signature: ljSign(pr, transaction)
  })
}

/**
 * 挂买单
 */

export const sendBid = async ({ assetId, valueId, price, amount, hexPubkey }, pr) => {
  const { transaction, order } = await (fetching('otc/bid', { assetId, valueId, price, amount, hexPubkey }, 'post'))
  // 不需要随机字符
  // const nonce = getNonce()
  return otcSign({
    id: order.id,
    signature: ljSign(pr, transaction)
  })
}

/**
 * 卖家吃单
 */

export const sendFreeAsk = async ({ id, hexPubkey }, pr) => {
  const { transaction, order } = await (fetching('otc/free/ask', { id, hexPubkey }, 'post'))
  return otcSign({
    id: order.id,
    signature: ljSign(pr, transaction)
  })
}

/**
 * 买家吃单
 * @param {*} param
 */
export const sendFreeBid = async ({ id, hexPubkey }, pr) => {
  const { transaction, order } = await (fetching('otc/free/bid', { id, hexPubkey }, 'post'))
  return otcSign({
    id: order.id,
    signature: ljSign(pr, transaction)
  })
}

/**
 * 订单签名
 * @param {*} param
 */
export const otcSign = async ({ id, signature }) =>
  await (fetching('otc/sign', { id, signature }, 'post'))

/**
 * 获取市场最新价格
 */

export const getPriceById = async marketId => await (fetching(`price/${marketId}`))

/**
 * 获取指定地址的交易记录用于个人成交单查询
 * @param {*} param
 */
export const getRedeem = async address => await (fetching(`redeem/${address}`))

/**
 * 获取指定地址的交易订单
 * @param {*} param
 */

export const getOrderByAddress = async address => await (fetching(`order/${address}`))

/**
 * 获取市场最新交易
 * @param {市场ID} marketId 
 */
export const getHistoryById = async ({marketId, active, length}) => await(fetching(`history/${marketId}`, { params: {active, length } }))

/**
 * 获取我的成交单
 * @param {市场ID} marketId 
 */
export const getMyHistoryById = async ({marketId, address, active, length}) => await(fetching(`history/${marketId}`, { params: {address, active, length} }))

/**
 * 获取区块高度
 * @return {height} [number] 高度
 */
export const getBlockHigh = async () => await (fetching('block/count/')).height

export default {
  getA,
  getB,
  getC,
  getH,
  getI,
  getO,
  getM,
  getU,
  getW,

  ask,
  askICO,
  bid,
  bidICO,
  cancel,
  getIO,
  redeem,
  transfer,

  getMarkets,
  getMarketsById,
  sendAsk,
  sendBid,
  sendFreeAsk,
  sendFreeBid,
  otcSign,
  getPriceById,
  getRedeem,
  getOrderByAddress,
  getHistoryById,
  getMyHistoryById,
  getBlockHigh
}

/**
 * Created by Administrator on 4/19/2017.
 */
