<template lang="pug">
  .plans
    .plans__title: h3 商业计划书 文档下载
    ul.plans__content
      li: a(:href="require('~static/蓝鲸淘商业计划书.pdf')") 蓝鲸淘商业计划书.pdf
      li: a(:href="require('~static/蓝鲸淘路演PPT 以及文字解说.doc')") 蓝鲸淘路演PPT（附带文字解说）.doc

</template>

<script>
  export default {}
</script>

<style lang="stylus">

  .plans
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
