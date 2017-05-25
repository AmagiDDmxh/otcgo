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
        .thumbnail(style="padding: 0;")
          .status__thumbnail__bg 申一科技
          .caption
            h4 基于小蚁区块链的应用平台服务商
            p 目前旗下产品有：
            p 蓝鲸淘————超导交易模式的智能资产转让平台
            p 蓝鲸淘————超导交易模式的智能资产众筹平台
            p 蓝鲸淘————小蚁生态首家承兑网关平台

      el-col(:span="10")
        el-row
          el-col(:span="16")
            h4 ANS      123321
          el-col.text-right(:span="8")
            h4 {{p}}%
          el-col
            el-progress(:stroke-width="18", :percentage="p")
        .detail-content
          p 本次目标金额：
            span XXXXXXX ANS
          p 剩余天数：
            span X 天
          p 当前支持人数：
            span X 人
          p 每份发行价：
            span XXXX ANS
        el-row
          el-input(placeholder="请输入申购份数")
          el-button.btn-block(type="primary", @click="click") 确认申购
</template>

<script>
  import { img } from '~utils/config'

  export default {
    data: () => ({
      p: 42,
      img
    }),
    methods: {
      click() {
        this.p++
      }
    }
  }
</script>

<style lang="stylus">
  placeholder()
    &::-webkit-input-placeholder
      {block}
    &:-moz-placeholder
      {block}
    &::-moz-placeholder
      {block}
    &:-ms-input-placeholder
      {block}

  input.el-input__inner
    margin-bottom: 10px
    +placeholder()
      text-align: center

  .el-row
    h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6
      margin: 0 0 10px

  .el-progress-bar
    padding-right: 0
    *
      border-radius: 0
    .el-progress__text
      display: none
      background: #000

  .thumbnail
    .status__thumbnail__bg
      height: 200px !important;
      width: 100%;
      background: linear-gradient(45deg, #4666f3, #35d3e4);
      color: #fff
      font-size: 40px
      text-align: center
      padding: 70px
    .caption
      padding: 20px 20px
      background: #f2f2f2
      color: #ababab
      line-height: 13px
      h4
        font-size: 21px
        color: #000
      p
        font-size: 14px

  .detail-content
    line-height: 15px
    color: #929292
    margin: 45px 0
    font-size: 14.67px
    /*span
      color: #35d4e4*/

  .el-row
    margin: 20px 0

  .el-row:first-child
    margin: 0 0 20px
</style>
