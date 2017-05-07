<template src="./header.html"></template>
<style lang="stylus" src="./header.styl"></style>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
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
        this.$router.push('/login')
      }
    },

    computed: {
      ...mapGetters(['loggedIn', 'wa', 'uid'])
    }
  }

</script>
