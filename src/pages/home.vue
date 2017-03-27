<template>
  <div>
    <div class="background">
      <div class="sign">
        <div class="group">
          <h2 style="color: hsl(0, 75%, 60%); margin: auto;">测试网</h2>
          <div class="betalogo">
            <img class="betalogo__img" src="../assets/logo.png" alt="logo">
          </div>

          <router-link class="sign__link" to="/createWallet"> 创建钱包 </router-link>
          <router-link class="sign__link" to="/login"> 登录钱包 </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style src="./home.css" scoped></style>