<template lang="pug">
  div.oContent
    .row
      .col-xs-12.col-lg-12
        button(:class="firstButton", @click="switchContent") CNY交易区
        button(:class="secondButton", @click="switchContent") ANS交易区
    .row
      .col-xs-12.col-lg-12
        table.table.table-bordred.table-striped.text-center
          thead
            tr.active
              th 资产名称
              th 资产类型
              th 发行方
              th 最新价格CNY
          tbody(v-if='point')
            tr
              td <img src="../../assets/ANS.png" /> 小蚁股ANS
              td 股权
              td 小蚁开发团队
              td 123
            tr
              td <img src="../../assets/ANC.png" /> 小蚁币ANC
              td 消费权
              td 小蚁开发团队
              td 123

</template>

<script>
  export default {
    data() {
      return {
        firstButton: ['oContent__tab', 'btn', 'btn-default', {'oContent__tab--active': true}],
        secondButton: ['oContent__tab', 'btn', 'btn-default', {'oContent__tab--active': false}],
        point: true
      }
    },
    methods: {
      switchContent(e) {
        e.target.classList.add('oContent__tab--active')
        if (e.target.previousSibling) {
          e.target.previousSibling.classList.remove('oContent__tab--active');
        }
        if (e.target.nextSibling) {
          e.target.nextSibling.classList.remove('oContent__tab--active')
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .oContent
    margin-top 30px
    margin-bottom 80px

  .oContent__tab
    -webkit-border-radius 0
    -moz-border-radius 0
    border-radius 0
    background #b2b2b2
    margin 10px 0
    color #fff
    border 0
    &:active
      -webkit-border-radius 0
      -moz-border-radius 0
      border-radius 0
      background rgb(0, 156, 225)
      margin 10px 0
      color #fff
      border 0
      outline-color #b2b2b2


  .oContent__tab--active
    background rgb(0, 156, 225)
</style>