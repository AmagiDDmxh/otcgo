<style lang="stylus" src="./oNav.styl" scoped></style>

<template>
  <nav class="navbar" role="navigation">
    <!-- Collect the nav links, forms, and other content for toggling -->
    <ul class="nav navbar-nav">
      <li class="first">
        <a class="menu">
          交易对
          <ul class="menulist">
            <router-link
                class="text-center pointer"
                :to="{path: '/markets',
                      query: { 'class': 'anscny' }}" tag="li">小蚁股-人民币
            </router-link>
            <router-link
                class="text-center pointer"
                :to="{path: '/markets',
                      query: { 'class': 'anccny' }}" tag="li">小蚁币-人民币
            </router-link>
            <router-link
                class="text-center pointer"
                :to="{path: '/markets',
                        query: { 'class': 'kacans' }}" tag="li">开拍币-小蚁股
            </router-link>

            <router-link
                class="text-center pointer"
                :to="{path: '/markets',
                      query: { 'class': 'lzglzj' }}" tag="li">量子股份-量子积分
            </router-link>
          </ul>
        </a>
      </li>

      <li><router-link class="menu" to="/"> 首 &nbsp; 页 </router-link></li>

      <!--<li><a class="menu" href="#">投资学院</a></li>

      <li><a class="menu" href="#">代币举报</a></li>-->

      <li><router-link class="menu" to="/ico/status">ICO专区</router-link></li>
      <li>
        <a class="menu"
           href="//shang.qq.com/wpa/qunwpa?idkey=24250f89f770858cb6e518fae271a588f847f8bfdc2e604a1ef40dea20b9beae"
           target="_blank">加入社群</a>
      </li>
    </ul>

    <form class="navbar-form navbar-right" style="margin-right: 20px;">
      <div class="form-group">
        <input type="text" class="form-control" placeholder="资产关键词搜索暂未开放" disabled>
      </div>
      <button type="submit" class="btn btn-default" @click.prevent="" disabled>搜索</button>
    </form>
  </nav>
</template>

<script>
  export default { }
</script>
