<template>
    <div>
        <hr class="user-line"/>
        <div class="user-info">
            <p><b>你的钱包地址是：</b> {{ address }}</p>
            <p><b>你的UID地址: </b>{{ uid }}</p>
        </div>
    </div>
</template>
<script>
  export default {
    computed: {
      address() {
        return this.$store.getters['ADD']
      },
      uid() {
        return this.$store.state.wa['u']
      }
    }
  }
</script>
<style lang="css">
    .user-line {
        margin: 0;
    }

    .user-info {
        margin-top: 30px;
    }
</style>
