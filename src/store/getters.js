/**
 * Created by Administrator on 4/24/2017.
 */

export default {
  assets: state => state.assets,
  loggedIn: state => state.loggedIn,
  wa: state => field => state.wa[field],
  uid: state => state.wa['uid'],
  balances: state => state.balances,
  deliver: state => state.deliver,
  receive: state => state.receive,
  fileName: state => state.fileName
}
