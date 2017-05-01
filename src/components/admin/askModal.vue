<template>
  <div class="askModal">
    <div class="row">
      <div class="col-xs-3"><b>{{deliver.name}}： </b></div>
      <div class="col-xs-3">可用： <span class="blue-span">{{deliver.valid}}</span></div>
      <div class="col-xs-3">冻结： <span class="blue-span">{{deliver.frozen}}</span></div>
      <div class="col-xs-3">最新成交价： <span class="blue-span">{{deliver.current_price}}</span></div>
    </div>
    <div class="row" style="margin-top:15px">
      <div class="col-xs-3"><b>{{receive.name}}： </b></div>
      <div class="col-xs-3">可用： <span class="blue-span">{{receive.valid}}</span></div>
      <div class="col-xs-3">冻结： <span class="blue-span">{{receive.frozen}}</span></div>
    </div>
    <hr/>
    <!-- 卖出量row -->
    <div class="row" style="margin-top:30px">
      <div class="col-xs-12">
        <div class="row">
          <div class="col-xs-3" style="line-height: 30px;">卖出量：</div>
          <div class="col-xs-6">
            <input
                type="text" class="form-control" placeholder="输入数量"
                v-model.number="amount" style="width:100%!important" @keyup="check" @blur="check"/>
          </div>
          <div class="col-xs-3 error-area" style="line-height:30px;">
            <span v-if="errors.amountEmpty"
                  class="error-text">数量不能为空</span>
            <span v-else-if="errors.amountWrong"
                  class="error-text">数量错误</span>
            <span v-else-if="errors.amountInvalid"
                  class="error-text">余额不足</span>
            <span v-else-if="success"> <img :src="img.yes"/> </span>
          </div>
        </div>
        <div class="row" style="margin-top:10px">
          <div class="col-xs-3" style="line-height: 30px;">卖出单价ANS：</div>
          <div class="col-xs-6">
            <input type="text" class="form-control" @keyup="check" @blur="check"
                   v-model.number="price" style="width:100%!important" placeholder="输入价格"/>
          </div>
          <div class="col-xs-3 error-area" style="line-height: 30px;">
            <span v-if="errors.priceEmpty"
                  class="error-text">价格不能为空</span>
            <span v-else-if="errors.priceWrong"
                  class="error-text">价格错误</span>
            <span v-else-if="errors.totalWrong"
                  class="error-text">请确保总价为整数值！</span>
            <span v-else-if="success"> <img :src="img.yes"/> </span>
          </div>
        </div>

        <!-- Click button for sell -->
        <div class="row" style="margin-top:10px">
          <div class="col-xs-3" style="line-height: 30px;"></div>
          <div class="col-xs-6">
            <el-button :loading="loading" class="btn btn-lj-gree btn-block" @click="transfer">卖出</el-button>
          </div>
        </div>

        <div class="row" style="margin-top: 15px;">
          <div class="col-xs-offset-2"><b>友情提示！由于小蚁股不可分割，请确保卖出总价（即卖出量*卖出单价）为整数！</b></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { img } from '~utils/config'

  export default {
    data: () => ({
      img,
      price: '',
      amount: '',
      loading: false,
      errors: {
        amountEmpty: false,
        amountWrong: false,
        amountInvalid: false,
        priceEmpty: false,
        priceWrong: false,
        totalWrong: false
      },
      success: false
    }),
    computed: {
      ...mapGetters(['deliver', 'receive'])
    },
    methods: {
      transfer() {
        if (!this.check()) {
          console.log("Error")
          return
        }
        this.loading = true
        this.$store.dispatch('ASK', { price: this.price, amount: this.amount })
            .then(() => {
              this.$message.success('交易成功!')
              this.loading = false
              this.$store.dispatch('GET_ASSET')
              this.amount = this.price = ''
              this.$emit('success')
            })
            .catch(e => {
              this.$message.error(e['non_field_errors'])
            })
      },
      check() {
        if (!this.price) this.errors.priceEmpty = true
        if (!this.amount) this.errors.amountEmpty = true
        if (this.amount > Number(this.deliver.valid)) this.errors.amountInvalid = true
        if (!this.$_.isNumber(this.amount)) this.errors.amountWrong = true
        if (!this.$_.isNumber(this.price)) this.errors.priceWrong = true
        if (!this.receive['divisible']) if (!this.$_.isInteger(this.price * this.amount)) this.errors.totalWrong = true

        for (let i in this.errors) {
          if (this.errors[i] === true) return false
        }
        this.success = true
        return true
      }
    }
  }
</script>

<style lang="css" scoped>
  .error-area {
    padding-left: 0;
  }
  .error-text {
    text-indent: 0;

  }
</style>