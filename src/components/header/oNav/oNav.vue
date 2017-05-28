<template>
  <nav class="navbar navbar-default" role="navigation">
    <!-- Collect the nav links, forms, and other content for toggling -->
    <ul class="nav navbar-nav">
      <li class="first">
        <a class="menu">
          分类资产
          <ul class="menulist">
            <router-link
                class="text-center pointer"
                :to="{path: '/markets',
                        query: { 'class': 'kacans' }}" tag="li">开拍币-小蚁股
            </router-link>
          </ul>
        </a>
      </li>

      <li>
        <router-link class="menu" to="/index" exact>
          首 &nbsp; 页
        </router-link>
      </li>

      <!--<li><a class="menu" href="#">投资学院</a></li>

      <li><a class="menu" href="#">代币举报</a></li>-->

      <li><router-link class="menu" to="/ico/status">ICO专区</router-link></li>
      <li>
        <a class="menu"
           href="//shang.qq.com/wpa/qunwpa?idkey=24250f89f770858cb6e518fae271a588f847f8bfdc2e604a1ef40dea20b9beae"
           target="_blank">加入社群</a>
      </li>

    </ul>
    <form class="navbar-form navbar-left">
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

<style lang="css" scoped>
  .nav > li > a:hover,
  .nav > li > a:focus {
    background: #009cff !important;
  }
</style>
