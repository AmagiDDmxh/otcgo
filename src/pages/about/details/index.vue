<template lang="pug">
.details
  .about__title: h3 私募细则
  ul.about__content
    li 股权结构：
      ul
        li 项目负责人：42.5%
        li 技术负责人：32.5%
        li 前端负责人：10%
        li 股权池（用于派发给后续加入团队的伙伴，以及营销支出）：15%
    li 本次私募共出让申一科技有限公司15%原始股权，计划融资150万小蚁股；15%的原始股权计划拆分为300份权益，每份权益包含0.05%的原始股权，每份价格为5000小蚁股。
    li 投资人最低申购一份权益，不设上限。
    li 社区投资人申购完毕后，小蚁基金会以同等价格包揽剩余的全部权益。
    li 私募结束后，计划在3个月后将公司股权登记在小蚁链上，并以股权代币的形式为投资人提供退出渠道。
    li 创始团队以及小蚁基金会的原始股权自私募结束起，将被冻结6个月。6个月之后，小蚁基金会的股权将自由流通；而创始团队的原始股权除了向市场二次融资而解冻之外（提前一个月向市场发出通告），不得以任何理由解冻。
    li 公司股权结构将会进行工商登记，当投资人拥有公司1%的股权时，有权利行使股东名册的工商登记。
    li 公司计划每6个月向投资人公示财务收支概况。
    li 股权池营销部分的筹码在3个月之后可直接流通(用于营销支出)；而派发给后续伙伴的股权参照创始团队筹码解冻规则。

</template>

<script>
  export default {}
</script>

<style lang="stylus" scoped>

  .about
    &__title
      border-bottom: 1px solid #ebebeb
    &__content
      & > a
        color: #009cff
      & > ul
        list-style: decimal
        padding-left: 20px
        & ul
          list-style: none
          padding-left: 0
      & > li
        margin-top: 20px

</style>
