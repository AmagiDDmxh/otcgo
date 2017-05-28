import { mapGetters } from 'vuex'

export default {
  data: () => ({
    onHistory: false,
    onOrder: false
  }),

  beforeRouteEnter(to, from, next) {
    next(vm => vm.$store.getters.loggedIn ? next() : next('/login'))
  },

  computed: {
    ...mapGetters(['loggedIn'])
  },

  methods: {
    handleNav() {
      this.onHistory = false
      this.onOrder = false
    }
  },

  updated() {
    if (!this.loggedIn) {
      this.$router.push('/login')
    }
  }
}
