<template lang="pug">
  .medias
    .medias__title: h3 媒体报道
    ul.medias__content
      li: a(href="http://www.sohu.com/a/142033091_456945") 申一科技入驻小蚁开源社区，上线智能资产管理平台
      li: a(href="http://www.sohu.com/a/127277835_456945") 超导交易：一场去中心化交易模式的革命！
</template>

<script>
  export default {}
</script>

<style lang="stylus" scoped>

  .medias
    &__content
      margin-top: 20px
      padding-left: 20px
      & > li
        margin-top: 0!important
        & > a
          color: #009cff
    &__title
      border-bottom: 1px solid #ebebeb
</style>
