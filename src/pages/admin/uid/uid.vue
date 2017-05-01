<template>
  <div>
    <hr class="user-line"/>
    <div class="user-info">
      <p><b>你的钱包地址是: </b>{{ address }}</p>
      <p><b>你的UID地址: </b>{{ uid }}</p>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters(['wa']),
      uid() {
        return this.wa('uid')
      },
      address() {
        return this.wa('address')
      }
    }
  }
</script>
<style lang="css">
  .user-line {
    margin: 0px;
  }

  .user-info {
    margin-top: 66px;
  }
</style>
