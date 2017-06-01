<template>
  <div id="topNav" class="navbar navbar-default navbar-static-top accounts topNav">

    <div class="navbar-header">
      <a class="btn btn-default navbar-toggle collapsed" data-toggle="collapse" data-target=".account-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </a>
    </div>

    <div class="navbar-collapse account-collapse collapse">
      <div class="container-fluid">

        <ul class="nav navbar-nav navbar-right">
          <li>
            <a href="">
              <el-button :plain="true" type="primary">区块浏览</el-button>
            </a>
          </li>
          <li>
            <a>
              <block-counter></block-counter>
            </a>
          </li>

        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import blockCounter from '~components/header/blockCounter'

  export default {
    name: 'topNav',

    components: { blockCounter },

    data: () => ({
      scrolled: false,
      navOpen: false
    })
  }
</script>

<style lang="stylus" scoped>
  @import "../../../styles/common";
  @import "../../../styles/variables.styl";

  .topNav
    background: white!important
    margin: 0!important
    .nav
      width: 40%
</style>
