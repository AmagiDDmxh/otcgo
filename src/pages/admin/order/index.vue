<template lang="pug">
  table.table.data-table.table-bordered.table-striped
    thead
      th 资产名称
      th 买入数量
      th 买入单价
      th 总计
      th(style={ width: '260px' })
    tbody(v-if="$route.params === 'ico'")
      tr(v-for="item in orders")
        td {{ item.name }}
        td ({{ item.baseAmount }} + {{ item.earlyBird }})
        td {{ item.price }}
        td {{ item.amount }}
        td.td-btn
          el-button(
          :loading="item.loading",
          v-if="item.canCancel",
          @click="cancel(item)"
          )  撤销
    tbody(v-else)
      tr(v-for="item in orders")
        td {{ item.name }}
        td {{ item.amount }}
        td {{ item.price }}
        td {{ item.price * item.amount }}
        td.td-btn
          el-button(
          v-if="item.status === 0",
          :loading="item.loading",
          @click="cancel(item)") 撤单

</template>

<script>
  export default {
    data: () => ({ orders: [] }),

    watch: {
      '$route'(to, from) {
        this.getOrders()
      }
    },

    methods: {
      getOrders() {
        switch (this.$route.params.type) {
          case 'otc': this.otcAsks(); break
          case 'ico': this.icoBids(); break
          default: return this.otcAsks()
        }
      },

      otcAsks() {
        return this.$store.dispatch('GET_ORDER')
                   .then(orders => this.orders = orders['asks'])
                   .catch(e => this.$message.error('获取挂单失败！请稍后再试！'))
      },

      icoBids() {
        return this.$store.dispatch('GET_ICO_ORDER')
                   .then(orders => this.orders = orders['data'])
                   .catch(e => this.$message.error('获取挂单失败！请稍后再试！'))
      },

      async cancel(item) {
        await this.stopFetch()

        const id = item.id
        setTimeout(() => this.$set(item, 'loading', true), 2000)
        try {
          const res = await this.$store.dispatch('CANCEL', { id })
          if (res) {
            this.startFetch()
            this.$message.success('撤单成功！')
          }
        } catch(e) {
          this.startFetch()
          // this.$message.error(e.body.non_field_errors[0])
          console.log(e)
        }
      },

      startFetch() {
        this.getOrders()
        window.orderTimer = window.setInterval(() => this.getOrders(), 1000 * 5)
      },

      stopFetch() {
        window.clearInterval(window.orderTimer)
      }
    },

    created() {
      this.startFetch()
    },

    destroyed() {
      this.stopFetch()
    }
  }
</script>

<style lang="css">


</style>
