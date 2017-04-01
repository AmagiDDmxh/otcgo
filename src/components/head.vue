<template src="./head.html"></template>
<style lang="stylus" src="./head.styl"></style>

<script>
  export default {
    name: 'h',
    data() {
      return {
        msg: '基于智能合约的数字资产交易平台',
        loginText: "登录钱包",
        creationText: "",
        UID: ''
      }
    },
    mounted: function () {
      if (window.LJWallet) {
        this.loginText = "我的钱包";
        this.creationText = "我的UID：" + this.UID;
        this.$http.get('uid/' + window.LJWallet.address).then((response) => {
          window.LJWallet.UID = response.data.uid;
          this.UID = response.data.uid;
        })
      }
    }
  }
</script>
