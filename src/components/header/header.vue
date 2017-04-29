<template src="./header.html"></template>
<style lang="stylus" src="./header.styl"></style>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'h',
    computed: {
      ...mapGetters(['loggedIn']),
      uid() {
        return this.$store.getters.field('uid')
      }
    }
  }

</script>
