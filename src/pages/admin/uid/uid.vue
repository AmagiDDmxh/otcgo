<template>
  <div>
    <hr class="user-line"/>
    <div class="user-info">
      <p><b>你的钱包地址是: </b>{{ address }}</p>
      <p><b>你的UID地址: </b>{{ uid }}</p>
      <p><b>你的私钥地址: </b>
        <span v-if="open">{{wif}}</span>
        <span v-if="!open" @click="openText" class="btn ljbutton">打开</span>
      </p>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      open: false
    }),

    computed: {
      ...mapGetters(['wa', 'uid']),
      address() {
        return this.wa('address')
      },
      wif() {
        return this.wa('wif')
      }
    },

    methods: {
      openText() {
        this.open = !this.open
      }
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
