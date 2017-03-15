<template>
  <div class="block-height">
    <img src="../assets/blockchain.png" alt="blockchain height">
    <span class="blue-span" style="margin-right: 24px;">{{ blockchainHeight }}</span>
    <img src="../assets/clock.png" alt="count down">
    <span class="blue-span">{{ time }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: 2,
      blockchainHeight: NaN
    }
  },

  methods: {
    run() {
      this.getHigh();
      refreshCount = setInterval(() => {
        console.log(this.time);
        this.time--;
        if (this.time === -1) {
          this.getHigh()
          this.time = 2;
        }
      }, 1000);
    },
    getHigh() {
      this.$http.get('block/count/').then(res => this.blockchainHeight = res.data.height);
    }
  },

  mounted() {
    this.run();
  },

  destroyed() {
    clearInterval(refreshCount);
    console.log('Destroyed the count')
  }
};

let refreshCount;

</script>

<style lang="css" scoped>
  .block-height {
    margin-top: -31px; 
    margin-left: -15px;
    display: block;
  }

</style>