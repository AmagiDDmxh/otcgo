import Vue from 'vue'
import { decrypt, doValidatePwd } from '../utils/ljsign'

const Add = 'add r'

export const getBalances = ({ [Add]: va }) => Vue.http.get(`balances/${va}`)
export const getUid = ({ [Add]: va }) => Vue.http.get(`uid/${va}`).then(({ data }) => data.uid)
export const getHistory = ({ [Add]: va }) => Vue.http.get(
    `balances/transfer/history/${va}`)

export const transfer = (
    state, { assetId, transfer_num, transfer_address_value }) => {
  return Vue.http.post('balances/transfer/', {
    assetid: assetId,
    amount: transfer_num,
    dest: transfer_address_value,
    source: state.wa[Add],
    hex_pubkey: state.wa['pb k'],
    compressed_pubkey: state.wa['pk c'],
  }, { emulateHTTP: true, emulateJSON: true }).then(({ data }) => {
    let postData = data
    postData.signature = ljSign(state.wa['pk y'],
        postData.transaction)
    delete postData.transaction

    return Vue.http.get('nonce/').then(({ data }) => {
      postData.nonce = data.nonce
      return Vue.http.post('sign/', postData, {
        emulateHTTP: true,
        emulateJSON: true,
      })
    })
  })
}
export const getLogin = ({ wa }, commit, pwd) => new Promise(
    (resolve, reject) => {
      try {
        const privateKey = decrypt(wa['pk r'], pwd)
        const result = doValidatePwd(privateKey, wa['pb k'])
        if (result) {
          resolve(privateKey)
        } else {
          reject(result)
        }
      } catch (err) {
        reject(err)
      }
    })

export default {
  getBalances,
  getUid,
  getHistory,
  getLogin,
  transfer,
}