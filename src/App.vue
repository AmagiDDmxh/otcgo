<template>
  <div class="app">
    <top-nav></top-nav>
    <div class="pageDiv container" style="background-color:#fff;">
      <h></h>

      <o-nav></o-nav>


      <transition name="fade" mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>


      <foot></foot>
      <div class="footer-link">
        Copyright &copy; 2017 &nbsp;<a href="https://otcgo.cn/">otcgo.cn</a>&nbsp; 版权所有 湘ICP备16019051号-1
      </div>
    </div>
  </div>
</template>
<script>
  import topNav from '~components/header/topNav'
  import h from './components/header/header.vue'
  import foot from './components/footer/footer.vue'
  import oNav from '~components/header/oNav/oNav.vue'

  export default {
    components: { h, foot, topNav, oNav }
  }
</script>

<style>
  /*common css*/
  body {
    font-family: "Microsoft YaHei", serif;
  }

  .container-padding {
    padding: 0 20px 20px!important;
  }

  .error-text {
    color: red;
    margin: 0;
    text-indent: 5px;
  }

  .btn-lj-red {
    background-color: #ff0000;
    color: #fff;
  }

  .btn-lj-red:hover {
    background-color: #ea0303;
    color: #fff !important;
  }

  /*common css*/

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: none;
  }

  .pageDiv {
    min-width: 1224px;
    padding: 0;
  }

  .logo {
    width: 100%;
    margin: 0 auto;
  }

  .logo > img {
    margin: 0 10px 0 50px;
  }

  .navbar {
    background-color: #000 !important;
    border: none !important;
  }

  .container-fluid {
    width: 1200px;
    margin: 0 auto;
  }

  .nav {
    width: 65%;
  }

  ul > .frist {
    background: url(images/ver-line.png) no-repeat left center;
  }

  ul > li > .menu {
    color: #fff !important;
    font-size: 1.2em;
    background: url(images/ver-line.png) no-repeat right center;
    padding-left: 30px !important;
    padding-right: 30px !important;
  }

  .menu > a {
    color: inherit;
  }

  .search {
    display: inline-block;
  }

  .container > div {
    height: 100%;
    width: 100%;
  }

  .msg {
    background-color: #f2f2f2;
    margin: 10px auto;
    width: 1200px;
    padding: 10px;
    border-radius: 6px;
  }

  .bg-blue {
    width: 50px;
    height: 50px;
    display: inline-block;
    border-radius: 6px;
    background: #009cff no-repeat center;
  }

  .bg-blue1 {
    background-image: url(images/foot-1.png);
  }

  .bg-blue2 {
    background-image: url(images/foot-2.png);
  }

  .bg-blue3 {
    background-image: url(images/foot-3.png);
  }

  .bg-blue4 {
    background-image: url(images/foot-4.png);
  }

  .foot-li {
    display: inline-block;
    font-family: '黑体';
    padding-left: 12px;
    vertical-align: top;
    padding-top: 4px;
  }

  .bg-li {
    background: url(images/ver-line2.png) right center no-repeat;
  }

  .foot-type {
    font-size: 22px;
    font-weight: 600;
    line-height: 1;
    padding-bottom: 5px
  }

  .foot-des {
    font-size: 20px;
    color: #5f5f5f;
    line-height: 1
  }

  .list-unstyled > li {
    width: 100%;
    padding-left: 75px;
    text-align: left;
  }

  .text-color {
    color: #666 !important
  }

  .text-color2 {
    color: #9d9d9d !important
  }

  .text-type2 {
    font-family: "黑体", serif;
  }

  .footer-link {
    background: #000;
    height: 135px !important;
    border-top: 5px solid #009cff;
    max-width: 1224px !important;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s ease;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
  }

  body {
    background-color: #eee;
  }
</style>
