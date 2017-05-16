<template>
  <div>
    <div class="row content-1">
      <p></p>
      <div class="col-xs-6 col-lg-6">
        <a href="#">
          <span></span>
          <img src="../../images/content_03.png" alt="">
        </a>
      </div>
      <div class="col-xs-6 col-lg-6">
        <router-link class="text-center" :to="{ path: '/markets', query: { 'class': 'anscny' }}">
          <span></span>
          <img src="../../images/content_05.png" alt="">
        </router-link>
      </div>
    </div>
    <div class="row content-2">
      <p></p>
      <div class="col-xs-6 col-lg-6">
        <router-link class="text-center" :to="{ path: '/markets', query: { 'class': 'anccny' }}">
          <span></span>
          <img src="../../images/content_09.png" alt=""></router-link>
      </div>
      <div class="col-xs-6 col-lg-6">
        <a href="#">
          <span></span>
          <img src="../../images/content_11.png" alt="">
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  .content-1 {
    img {
      width: 100%;
      height: 100%;
    }
    p {
      height: 45px;
      margin: 30px 15px 10px 15px;
      background: url('../../images/content-header-1.png') no-repeat;
      border-bottom: 1px solid #666;
    }

    a {
      display: block;
      height: 100%;
      width: 100%;
      position: relative;
      &:hover span {
        display: block;
        height: 100%;
        width: 100%;
        position: absolute;
        cursor: pointer;
      }
    }
  }

  .page-index {
    height: 1100px;
  }

  .content-2 {
    p {
      height: 45px;
      margin: 30px 15px 10px 15px;
      background: url('../../images/content-header-2.png') no-repeat;
      border-bottom: 1px solid #666;
    }
    img {
      width: 100%;
      height: 100%;
    }
    a {
      display: block;
      height: 100%;
      width: 100%;
      position: relative;
      &:hover span {
        display: block;
        height: 100%;
        width: 100%;
        position: absolute;
        cursor: pointer;
      }
    }
  }

</style>