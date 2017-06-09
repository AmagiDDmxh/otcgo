<template>
  <div>
    <table class="table history-table table-bordred table-responsive table-striped" style="table-layout: fixed;">
      <thead>
        <tr style="background: #efefef;">
          <th>类型</th>
          <th>交易对</th>
          <th>成交数量</th>
          <th>单价</th>
          <th>成交时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="history in histories">
          <td class="col-md-2">{{history['way'] ? '卖出' : '买入' }} </td>
          <td class="col-md-2" v-if="history['name'] === 'kacans'">KAC \ ANS</td>
          <td class="col-md-2" v-else>{{history['name']}}</td>
          <td class="col-md-2">{{history['amount']}}</td>
          <td class="col-md-2">{{history['price']}}</td>
          <td :title="history['time']" class="col-md-2">
            <el-icon name="time"></el-icon>
            {{history['time']}}
          </td>
          <td class="col-md-2" style="vertical-align: middle;">
            <el-button v-if="history['redeem']" class="link-span-seal" :disabled="true">已取回</el-button>
            <el-button v-else class="btn ljbutton"
                       :loading="history['loading']"
                       @click="redeem(history)">取回
            </el-button>
          </td>
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

      getHistory(params) {
        this.$store.dispatch('GET_HISTORY', {
          name: 'redeem',
          params: {
            active: this.currentPage,
            length: this.pageLength
          }
        }).then(r => {
          this.histories = r['data'].map(i => {
            i.loading = false
            return i
          })
          this.total = r['item_num']
        })
      },

      redeem(history) {
        history.loading = true
        this.$store.dispatch('REDEEM', history)
            .then(() => {
              history.redeem = true
              this.getHistory()
              this.$message.success('取回成功!')
            })
            .catch(e => {
              history.loading = false
              this.$message.error('取回失败！', e.non_field_error)
            })
      }
    },
    mounted() {
      this.handleCurrentChange()
    }
  }
</script>

<style lang="stylus" scoped>
  .table > thead > tr > th, .table > tbody > tr > td
    text-align: center
</style>