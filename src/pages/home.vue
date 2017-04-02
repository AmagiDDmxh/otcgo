<template>
  <div class="page-index">
    <div class="index ">
      <div class="row">
        <div class="col-xs-12 col-lg-12">
          <div id="myCarousel" class="carousel slide" data-ride="carousel" data-interval="5000">
            <!-- 轮播（Carousel）指标 -->
            <ol class="carousel-indicators">
              <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
              <li data-target="#myCarousel" data-slide-to="1"></li>
              <li data-target="#myCarousel" data-slide-to="2"></li>
            </ol>
            <!-- 轮播（Carousel）项目 -->
            <div class="carousel-inner">
              <img class="item active" src="../assets/banner_1.png" alt="蓝鲸淘">
              <img class="item " src="../assets/slide2.png" alt="蓝鲸淘">
              <img class="item " src="../assets/slide3.png" alt="蓝鲸淘">
            </div>
            <!-- 轮播（Carousel）导航 -->
            <a class="carousel-control left" href="#myCarousel" data-slide="prev">
              <img style="margin-top:-10px;width:52px;" src="../assets/banner-left.png" alt=""/>
            </a>
            <a class="carousel-control right" href="#myCarousel" data-slide="next">
              <img style="margin-top:-10px;width:52px;" src="../assets/banner-right.png" alt=""/>
            </a>
          </div>
        </div>
      </div>
      <o-content-old></o-content-old>
    </div>
  </div>
</template>

<script>
  import oContentOld from '../components/common/contentOld.vue'
  export default {
    components: { oContentOld }
  }
</script>

<style lang="stylus">
  .carousel-control {
    background: #8e8e8e;
    height: 100px;
    line-height: 100px;
    font-size: 50px !important;
    width: 51px !important;
    margin-top: 140px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0);
    background-image: none;
  }

  .carousel-inner img {
    width: 100%;
    height: 400px;
  }
</style>
