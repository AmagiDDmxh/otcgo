<template lang="pug">
  .test
    el-button(@click="download") Test download
    .content
      textarea(v-model.trim="text")
</template>

<script>
  // import { Blob } from '~polyfill'

  export default {
    data: () => ({
      text: ''
    }),
    methods: {
      download() {
        const file = new Blob([this.text], { type: 'text/plain' })
        const aLink = document.createElement('a')
        aLink.href = URL.createObjectURL(file)
        aLink.download = 'test.json'
        aLink.click()
      }
    }
  }
</script>

<style lang="css">


</style>
