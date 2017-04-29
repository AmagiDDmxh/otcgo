

/**
 * Created by Administrator on 4/24/2017.
 */


export default {
  asset: state => state['asset'],
  loggedIn: state => state['loggedIn'],
  field: state => field => state.wa[field]
}