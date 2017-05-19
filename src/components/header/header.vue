<template src="./header.html"></template>
<style lang="stylus" src="./header.styl"></style>

<script>
  import oNav from './oNav/oNav.vue'
  import blockCounter from '~components/header/blockCounter/index.vue'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: { oNav, blockCounter },
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
