<template lang="pug">
  .status.container
    .panel.panel-default.panel-state
      .panel-body
        span.blue-span 众筹专区
    el-row.status__body(:gutter="30")
      el-col(:span="6")
        .ad-tips
          .ad-tips__title 申购指南
          .ad-tips__content
            p
              router-link(to="/login") 登陆个人钱包
              | ，在对应的项目
            p 专区创建“申购订单”并提交。
            hr
            p 众筹日期截止或满额，申购
            p 通道关闭。
      el-col(:span="8")
        .thumbnail
          img(src='../../assets/logo.png')
          .caption
            .caption
              h3 Thumbnail label
              p ...span
              p
                a.btn.btn-primary
                a.btn

      el-col(:span="10")
        el-row
          el-col(:span="16")
            h4 ANS      123321
          el-col.text-right(:span="8")
            h5 {{p}}%
        el-row
          el-progress(:stroke-width="18", :percentage="p")
        el-row
          el-button.btn-block(type="primary", @click="click") click
</template>

<script>
  export default {
    data: () => ({
      p: 42
    }),
    methods: {
      click() {
        this.p++
      }
    }
  }
</script>

<style lang="css">

  .el-progress-bar * {
    border-radius: 0;
  }

  .el-progress-bar{
    padding-right: 0;
  }

  .el-progress__text {
    display: none;
    background: #000;
  }

  .el-row {
    margin: 20px 0;
  }

  .el-row:first-child {
    margin: 0 0 20px;
  }
</style>