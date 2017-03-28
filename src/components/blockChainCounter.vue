<template>

  <div class="row" style="margin: 0 0 10px -30px;">
    <div class="col-md-12">
      <img src="../assets/blockchain.png" alt="blockchain height">
      <span class="blue-span" style="margin-right: 24px;">{{ blockchainHeight }}</span>
      <img src="../assets/clock.png" alt="count down">
      <span class="blue-span">{{ time }}</span>
    </div>
  </div>

</template>

<script>

  export default {
    data() {
      return {
        time: 0,
        blockchainHeight: NaN
      }
    },

    watch: {
      blockchainHeight(newHeight) {
        this.time = 0;
      }
    },

    methods: {
      run() {
        counter = setInterval(() => this.time++, 1000);
        gethigh = setInterval(() => this.getHigh(), 2000);
      },
      getHigh() {
        this.$http.get('block/count/').then(res => this.blockchainHeight = res.data.height);
      }
    },

    mounted() {
      this.getHigh();
      this.run();
    },

    destroyed() {
      clearInterval(counter);
      clearInterval(gethigh);
    }
  };

  let counter;
  let gethigh;

</script>

<style lang="css" scoped>


</style>