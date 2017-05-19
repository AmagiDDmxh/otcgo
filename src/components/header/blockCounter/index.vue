<template>
  <div class="block">
    <div class="block__time">
      <img :src="timeImg" alt="">
      {{ blockTime }}
    </div>
    <div class="block__high">
      <img :src="highImg" alt="">
      {{ blockHigh }}
    </div>
  </div>
</template>

<script>
  const timeImg  = require('~images/block-time.png')
  const highImg = require('~images/block-high.png')

  export default {
    data: () => ({
      blockTime: 0,
      blockHigh: NaN,
      timeImg,
      highImg
    }),

    watch: {
      blockHigh() { this.blockTime =  0 }
    },

    methods: {
      async getCount() {
        this.blockHigh = (await this.$store.dispatch('GET_BLOCK')).height
      },
      run() {
        this.counter = setInterval(() => this.blockTime++, 1000)
        this.getHighTimer = setInterval(() => this.getCount(), 2000)
      }
    },

    mounted() {
      this.getCount()
      this.run()
    },

    destroyed() {
      clearInterval(this.counter)
      clearInterval(this.getHighTimer)
    }
  }
</script>

<style lang="stylus" scoped>

  .block
    overflow: auto
    color: #009cff
    img
      margin: 0 2px 0 0
    .block__time
      float: right
    .block__high
      float: right
      margin-right: 30px

</style>