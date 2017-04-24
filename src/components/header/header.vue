<template src="./header.html"></template>
<style lang="stylus" src="./header.styl"></style>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'h',
    props: ['uid'],
    data: ()=>({
      subActive: false
    }),
    computed: mapGetters(['uid', 'loggedIn'])
  }

</script>
