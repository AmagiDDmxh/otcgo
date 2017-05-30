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
    handleNav(str) {
      if (typeof str === 'string') {
        const arrStr = str.split('')
        const capitalizeStr = arrStr[0].toUpperCase() + str.substr(str.indexOf(arrStr[0]) + 1)
        this['on' + capitalizeStr] = !this['on' + capitalizeStr]
      } else {
        this.onHistory = this.onOrder = false
      }
    }
  },

  updated() {
    if (!this.loggedIn) {
      this.$router.push('/login')
    }
  }
}
