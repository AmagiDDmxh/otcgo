<template>
  <div class="page-index">
    <div class="index">
      <el-carousel :interval="5000" arrow="always" height="400px" class="carousel-inner">
        <el-carousel-item>
          <img class="item active" src="../assets/banner_1.png" alt="蓝鲸淘">
        </el-carousel-item>
        <el-carousel-item>
          <img class="item active" src="../assets/slide2.png" alt="蓝鲸淘">
        </el-carousel-item>
        <el-carousel-item>
          <img class="item active" src="../assets/slide3.png" alt="蓝鲸淘">
        </el-carousel-item>
      </el-carousel>
      <o-content></o-content>
    </div>
  </div>
</template>

<script>
  import oContent from '../components/common/OContent.vue'
  export default {
    components: { oContent }
  }
</script>

<style lang="stylus">
  .carousel-control
    background: #8e8e8e;
    height: 100px;
    line-height: 100px;
    font-size: 50px !important;
    width: 51px !important;
    margin-top: 140px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0);
    background-image: none;


  .carousel-inner img
    width: 100%;
    height: 400px;
</style>
