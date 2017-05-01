<template>
  <div class="obligation">
    <table class="table data-table table-bordred table-striped">
      <thead>
        <th>资产类型 </th>
        <th>购买数量</th>
        <th>购买单价/CNY</th>
        <th>总计/CNY</th>
        <th></th>
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
        this.$store.dispatch('GET_ORDER').then(r => {
          this.orders = r['asks'].map(i => {
            i.loading = false
            return i
          })
        })
      },
      cancel(item) {
        this.$_.set(item, 'loading', true)
        this.$store.dispatch('CANCEL', { id: item.id })
            .then(() => {
              this.getOrders()
              this.$message.success('撤单成功！')
              item.loading = false
            })
            .catch(() => {
              this.$message.success('撤单失败！请重新尝试！')
              this.getOrders()
              item.loading = false
            })
      }
    },
    mounted() {
      this.getOrders()
    }
  }
</script>

<style lang="css" scoped>
  .td-btn {
    width: 260px;
  }
</style>
