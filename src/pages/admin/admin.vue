<template src="./admin.html"></template>
<style src="./admin.css" lang="css"></style>

<script>
  import counter from '../../components/blockChainCounter.vue'

  export default {
    components: {counter},
    data() {
      return {
        sub_li: false,
        isActive: false,
      }
    },

    methods: {
      exitWallet() {
        this.$router.push({path: '/'});
        this.$store.dispatch('reset');
      }
    },

    mounted() {
      if (!this.$store.getters.HAS){
        this.$router.replace({ path: '/login' });
      }
    }
  }
</script>