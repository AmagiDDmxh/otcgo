<template>
  <div>
    <table class="table history-table table-bordred table-striped table-responsive" style="table-layout: fixed;">
      <thead>
        <tr style="background: #efefef;">
          <th style="width:40%;vertical-align: middle;text-align: center;">对方地址</th>
          <th>资产名称</th>
          <th>资产数量</th>
          <th>转账时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="history in histories">
          <td class="col-md-6"
              style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;vertical-align: middle;text-align: center;">
            <a class="link-interact"
               :href="`//antchain.xyz/tx/hash/${history['txid']}`"
               target="_blank">{{history['dest']}}</a>
          </td>
          <td class="col-md-2" style="vertical-align: middle;">{{history['name']}}</td>
          <td class="col-md-2" style="vertical-align: middle;">{{history['amount']}}</td>
          <td :title="history['time']" class="col-md-2">{{history['time']}}</td>
        </tr>
      </tbody>
    </table>

    <div class="row">
      <div class="col-xs-12">
        <div class="pull-right">
          <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[7, 15, 30, 50]"
                :page-size="pageLength"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      histories: [],
      currentPage: 1,
      pageLength: 7,
      total: 0
    }),

    methods: {
      handleSizeChange(val) {
        this.pageLength = val
        this.getHistory()
      },

      handleCurrentChange(val) {
        this.currentPage = val
        this.getHistory()
      },

      getHistory() {
        this.$store.dispatch('GET_HISTORY', {
          name: 'transfer',
          params: {
            active: this.currentPage,
            length: this.pageLength
          }
        }).then(r => {
          this.histories = r['data']
          this.total = r['item_num']
          this.$store.dispatch('GET_ASSET')
        }).catch(() => {
          this.$message.error('获取转账记录失败！')
        })
      }
    },

    mounted() {
      this.handleCurrentChange()
    }
  }
</script>

<style lang="css" scoped>

</style>