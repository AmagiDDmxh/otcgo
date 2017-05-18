<template>
  <div>
    <hr class="user-line"/>
    <div class="user-info">
      <p><b>你的钱包地址: </b>{{ address }}</p>
      <p><b>你的UID: </b>{{ uid }}</p>
      <p><b>你的WIF私钥: </b>
        <span @click="open = !open" class="btn ljbutton">{{open? '关闭':'打开'}}</span>
        <span v-if="open">{{wif}}</span>
      </p>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      open: false,
      number: 0,
      animatedNumber: 0
    }),

    computed: {
      ...mapGetters(['wa', 'uid']),
      address() { return this.wa('address') },
      wif() { return this.wa('wif') }
    }
  }
</script>

<style lang="css">
  .user-line {
    margin: 0;
  }

  .user-info {
    margin-top: 66px;
  }
</style>
