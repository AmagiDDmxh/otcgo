<template lang="pug">
  .page-index
    .index
      el-carousel(:interval="5000", height="400px")
        el-carousel-item(v-for="banner in banners")
          router-link(:to="banner.route")
            img(:src="banner.src", :alt="banner.dec")
      o-content

      // el-button(:loading="loading", @click="hand") adadad
      // el-menu(default-active="2", @open="handleOpen", @close="handleClose")
        el-submenu(index="1")
          template(slot="title") 导航一
          el-menu-item-group(title="分组一")
            el-menu-item(index="1-1") 选项1
            el-menu-item(index="1-2") 选项2
          el-menu-item-group(title="分组2")
            el-menu-item(index="1-3") 选项3
          el-menu-item-group
            el-submenu(index="1-4")
              template(slot="title") 选项4
              el-menu-item(index="1-4-1") 选项1
        el-submenu(index="2")
          template(slot="title") 导航二
          el-menu-item(index="2-1") 选项1
          el-menu-item(index="2-2") 选项2
          el-menu-item-group
            el-submenu(index="2-3")
              template(slot="title") 选项3
              el-menu-item(index="2-3-1") 选项3-4
        el-menu-item(index="3") 导航三

</template>

<script>
  import oContent from '../../components/common/oContent/index.vue'

  export default {
    components: { oContent },

    data: () => ({
      banners: [
        { src: require('../../images/banner1.jpg'), dec: '蓝鲸淘正式上线开拍币\\小蚁股交易对',
          route: { path: '/markets', query: { 'class': 'kacans' }}},
        { src: require('../../images/banner2.jpg'), dec: '去中心化 ‘ICO’ 功能上线，蓝鲸淘 ‘私募计划’ 启动',
          route: { path: '/ico/status' }}
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
