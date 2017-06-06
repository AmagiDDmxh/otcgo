<template lang="pug">
  table.table.data-table.table-bordered.table-striped
    thead
      th 资产名称
      th 买入数量
      th 买入单价ANS
      th 总计ANS
      th(style={ width: '260px' })
    tbody
      tr(v-for="item in orders")
        td {{ item.name }}
        td ({{ item.baseAmount }} + {{ item.earlyBird }})
        td {{ item.price }}
        td {{ item.amount }}
        td.td-btn
          el-button.btn.ljbutton(:loading="item.loading", v-if="item.canCancel", @click="cancel(item)")  撤销
</template>

<script>
  export default {

    data: () => ({ orders: [] }),

    methods: {
      getOrders() {
        return this.$store.dispatch('GET_ICO_ORDER')
                   .then(orders => this.orders = orders['data'].map(i => { i.loading = false; return i }))
                   .catch(e => this.$message.error('获取挂单失败！请稍后再试！'))
      },

      async cancel(item) {
        await this.stopFetch()
        setTimeout(() => this.$set(item, 'loading', true), 2000)
        try {
          const res = await this.$store.dispatch('CANCEL', { id })
          if (res) {
            this.startFetch()
            this.$message.success('撤单成功！')
          }
        } catch(e) {
          this.startFetch()
          this.$message.error(e.body.non_field_errors[0])
        }
      },

      startFetch() {
        this.getOrders()
        this.orderTimer = window.setInterval(() => this.getOrders(), 1000 * 2)
      },

      stopFetch() {
        clearInterval(this.orderTimer)
      }
    },

    mounted() {
      this.startFetch()
    },

    destroyed() {
      this.stopFetch()
    }

  }
</script>

<style lang="css">


</style>
