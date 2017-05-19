<template lang="pug">
  .page-index
    .index
      el-carousel(:interval="5000", height="400px")
        el-carousel-item
          router-link(:to="{path: '/markets/', query: { class: 'kacans' }}")
            img(:src="banners[0]", alt="Banner, 海报")
      o-content
</template>

<script>
  import oContent from '../components/common/oContent/index.vue'
  import { required, minLength, between } from 'vuelidate/lib/validators'

  export default {
    components: { oContent },

    data: () => ({
      banners: [require('../images/banner1.jpg'), require('../images/slide2.png'), require('../images/slide3.png')]
    })
  }
</script>

<style lang="stylus">
  .el-table__body
    text-align: center

  .el-table__header .is-leaf
    text-align: center

  .el-carousel__item img
    width: 100%
    height: 400px

  .el-carousel__container > button
    display: none

  /*  .carousel-control
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
      height: 400px;*/
</style>
