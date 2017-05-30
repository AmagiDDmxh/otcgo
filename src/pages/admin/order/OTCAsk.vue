<template>
  <div class="obligation">
    <table class="table data-table table-bordred table-striped">
      <thead>
        <th>资产名称</th>
        <th>卖出数量</th>
        <th>卖出单价ANS</th>
        <th>总计ANS</th>
        <th style="width: 260px;"></th>
      </thead>
      <tbody>
        <tr v-for="item in orders">
          <td>{{item.name}}</td>
          <td>{{item.amount}}</td>
          <td>{{item.price}}</td>
          <td>{{item.price * item.amount}}</td>
          <td class="td-btn">
            <el-button
                class="btn ljbutton"
                v-if="item.status === 0"
                @click="cancel(item)"> 撤单
            </el-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    data: () => ({
      orders: []
    }),

    methods: {
      getOrders() {
        return this.$store.dispatch('GET_ORDER')
          .then(orders => this.orders = orders['asks'])
          .catch(e => this.$message.error('获取挂单失败！请稍后再试！'))
      },

      async cancel({ id }) {
        // await this.stopFetch()

        try {
          const res = await this.$store.dispatch('CANCEL', { id })
          if (res) {
            // this.startFetch()
            this.$message.success('撤单成功！')
          }
        } catch(e) {
          // this.startFetch()
          console.log(e)
          this.$message.error('撤单失败！请重新尝试！')
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

<style lang="css" scoped>
  .td-btn {
    width: 260px;
  }
  .el-button:focus, .el-button:hover {
    color: #fff;
  }
</style>
