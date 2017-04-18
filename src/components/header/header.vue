<template src="./header.html"></template>
<style lang="stylus" src="./header.styl"></style>

<script>
  function justReturn(value) {
    return value
  }

  export default {
    name: 'h',
    data: ()=>({
      subActive: false
    }),
    computed: {
      loginText() {
        if (window.LJWallet) {
          return '我的钱包'
        } else {
          return '登陆钱包'
        }
      },
      creationText() {
        return '创建钱包';
      }
    }
  }

</script>
