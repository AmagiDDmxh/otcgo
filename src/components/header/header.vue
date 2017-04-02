<template src="./header.html"></template>
<style lang="stylus" src="./header.styl"></style>

<script>
  function justReturn(value) {
    return value
  }

  export default {
    name: 'h',
    data() {
      return {
        hasLogin: false
      }
    },
    computed: {
      loginText() {
        if (window.LJWallet) {
          return '我的钱包'
        } else {
          return '登陆钱包'
        }
      },
      creationText() {
        if (window.LJWallet) {
          this.$http.get(`uid/${window.LJWallet.address}/`).then(({ data }) => {
            this.hasLogin = true
            return justReturn(`我的UID：${data['uid']}`)
          })
        } else {
          this.hasLogin = false
          return ''
        }
      }
    }
  }

</script>
