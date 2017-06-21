<template lang="pug">
  .page-index
    .index
      el-carousel(:interval="5000", height="400px")
        el-carousel-item(v-for="banner in banners")
          router-link(:to="banner.route").progressive
            img.preview(
            v-progressive="banner.src",
            :src="banner.preview",
            :alt="banner.dec",
            :data-src="banner.src"
            )
      o-content
</template>

<script>
  import oContent from '../../components/common/oContent/index.vue'

  export default {
    components: { oContent },

    data: () => ({
      banners: [
        {
          src: require('~images/banner_LZG-LZJ.jpg'),
          preview: require('~images/banner_LZG-LZJ-r.jpg'),
          dec: '量子积分与量子股份交易对海报',
          route: {
            path: '/markets',
            query: { 'class': 'lzglzj' }
          }
        },
        {
          src: require('~images/banner_KAC-ANS.jpg'),
          preview: require('~images/banner_KAC-ANS-r.jpg'),
          dec: '蓝鲸淘正式上线开拍币\\小蚁股交易对',
          route: {
            path: '/markets',
            query: { 'class': 'kacans' }
          }
        }
      ],
      loading: false
    }),

    methods: {
      handleOpen(a, b) {
        console.log('[open]: ', a, b)
      },

      handleClose(a, b) {
        console.log('[close]: ', a, b)
      },

      hand() {
        this.loading = true
        this.$store.dispatch('GET_ASSET')
            .then(() => this.loading = false)
      }
    }
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
