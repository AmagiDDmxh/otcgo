<template src="./header.html"></template>
<style lang="stylus" src="./header.styl"></style>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'h',
    data: () => ({
      activeMarkets: false
    }),

    methods: {
      active() {
        this.activeMarkets = true
      }
    },

    computed: {
      ...mapGetters(['loggedIn', 'wa']),
      uid() {
        return this.$store.getters['uid']
      }
    }
  }

</script>
