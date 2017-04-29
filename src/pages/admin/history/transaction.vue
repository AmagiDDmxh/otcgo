<template>
  <table class="table history-table table-bordred table-responsive table-striped" style="table-layout: fixed;">
    <thead>
      <tr style="background: #efefef;">
        <th>币种</th>
        <th>资产类型</th>
        <th>成交数量</th>
        <th>单价</th>
        <th>转账时间</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="history in histories">
        <td class="col-md-2" style="vertical-align: middle;">{{history['way'] ? '卖出':'买入' }} </td>
        <td class="col-md-2" style="vertical-align: middle;">{{history['name']}}</td>
        <td class="col-md-2" style="vertical-align: middle;">{{history['amount']}}</td>
        <td class="col-md-2" style="vertical-align: middle;">{{history['price']}}</td>
        <td :title="history['time']" class="col-md-2">
          <el-icon name="time"></el-icon>
          {{history['time']}}
        </td>
        <td class="col-md-2" style="vertical-align: middle;">
          <span v-if="history['redeem']" class="link-span-seal">已取回</span>
          <span v-else class="link-span" @click="redeem(history['id'])">取回</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    mounted() {
      this.getHistories()
      window.timer = setInterval(() => this.getHistories(), 1000 * 2)
    },
    destoryed() {
      window.clearInterval(timer)
    },
    data: () => ({
      histories: []
    }),
    methods: {
      redeem(id) {
        this.$store.dispatch('REDEEM', id).then(() => {
          this.getHistories()
          this.$message.success('取回成功!')
        })
      },
      getHistories() {
        this.$http.get(`redeem/${window.LJWallet['address']}`).then(({ data }) => this.histories = data)
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .table > thead > tr > th, .table > tbody > tr > td
    text-align: center
</style>