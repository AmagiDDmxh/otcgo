import { mapGetters } from 'vuex'

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.loggedIn ? next() : next({ path: '/login' })
    })
  },

  computed: {
    ...mapGetters(['loggedIn'])
  },

  updated() {
    if (!this.loggedIn) {
      this.$router.push('/login')
    }
  }
}
