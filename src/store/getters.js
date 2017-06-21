/**
 * Created by Administrator on 4/24/2017.
 */

const check = ['address', 'privateKey', 'privateKeyEncrypted', 'publicKey', 'publicKeyCompressed']

export default {
  assets: state => state.assets,
  loggedIn: state => check.every(i => state.wa.hasOwnProperty(i)) && !state.signUp,
  wa: state => field => state.wa[field],
  uid: state => state.wa['uid'],
  balances: state => state.balances,
  deliver: state => state.deliver,
  receive: state => state.receive,
  fileName: state => state.fileName,
  signUp: state => state.signUp,
  blockHeight: state => state.blockHeight
}
