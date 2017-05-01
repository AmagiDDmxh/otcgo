export default {
  data() {
    return {
      order_sub_li: false,
      history_sub_li: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.getters['loggedIn'] ? next() : next({ path: '/login' })
    })
  }
}
