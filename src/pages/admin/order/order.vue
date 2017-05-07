<template>
  <div class="obligation">
    <table class="table data-table table-bordred table-striped">
      <thead>
        <th>资产类型 </th>
        <th>购买数量</th>
        <th>购买单价</th>
        <th>总计</th>
        <th style="width: 260px;"></th>
      </thead>
      <tbody>
        <tr v-for="item in orders">
          <td>{{item.name}}</td>
          <td>{{item.amount}}</td>
          <td>{{item.price}}</td>
          <td>
            {{item.price * item.amount}}
          </td>
          <td class="td-btn">
            <el-button
                :loading="item.loading"
                class="btn ljbutton"
                v-if="item.status==0"
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
          .then(orders => this.orders = orders['asks'].map(i => { i.loading = false; return i }))
          .catch(e => this.$message.error('获取挂单失败！请稍后再试！'))
      },
      async cancel(item) {
        const id = item.id

        this.$_.set(item, 'loading', true)
        try {
          const res = await this.$store.dispatch('CANCEL', {id})
          if (res) {
            this.getOrders()
            this.$message.success('撤单成功！')
          }
        } catch(e) {
          this.getOrders()
          this.$message.success('撤单失败！请重新尝试！')
        }
      }
    },

    mounted() {
      this.getOrders()
      window.orderTimer = window.setInterval(() => this.getOrders(), 1000 * 2)
    },

    destroyed() {
      window.clearInterval(window.orderTimer)
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
