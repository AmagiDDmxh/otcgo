<template src="./header.html"></template>
<style lang="stylus" src="./header.styl" scoped></style>

<script>
  import blockCounter from '~components/header/blockCounter/index.vue'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: { blockCounter },
    name: 'h',
    data: () => ({
      activeMarkets: false
    }),

    methods: {
      ...mapActions(['LOGOUT']),
      active() {
        this.activeMarkets = true
      },
      logout() {
        this.LOGOUT()
        this.$message.success('你已成功退出！')
      }
    },

    computed: {
      ...mapGetters(['loggedIn', 'wa', 'uid'])
    }
  }

</script>
