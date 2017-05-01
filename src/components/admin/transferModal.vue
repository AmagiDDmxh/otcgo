<template>
  <div class="transferModal">
    <div class="row">
      <div class="col-xs-6">
        <b>资产类型:{{ deliver.name }}</b>
      </div>
      <div class="col-xs-6 text-right">
        <b>可用数量:{{ deliver.valid }}</b>
      </div>
    </div>
    <!-- 转账数量 -->
    <div class="row" style="margin-top:20px">
      <span class="col-xs-3" style="margin-top:8px">转账数量:</span>
      <div class="col-xs-6">
        <input
            type="text" class="form-control" @keyup="check"
            v-model.number="amount" style="width:100%!important" @focus="selectAll" @blur="check">
      </div>
      <div class="col-xs-3">
        <span v-if="errors.amountWrong"
              class="error-text"> 数量错误 </span>
        <span v-else-if="errors.amountEmpty"
              class="error-text"> 数量不能为空 </span>
        <span v-else-if="success"> <img src="/src/assets/yes.png"/> </span>
      </div>
    </div>

    <!-- 转账地址 -->
    <div class="row" style="margin-top:20px">
      <span class="col-xs-3" style="margin-top:8px">转账地址:</span>
      <div class="col-xs-6">
        <input type="text" class="form-control" @keyup="check"
               v-model.trim="address" style="width:100%!important" @focus="selectAll" @blur="check">
      </div>
      <div class="col-xs-3">
        <span v-if="errors.addWrong"
              class="error-text"> 地址格式错误 </span>
        <span v-else-if="errors.addEmpty"
              class="error-text"> 地址不能为空 </span>
        <span v-else-if="errors.addLenErr"
              class="error-text"> 地址必须是34位 </span>
        <span v-else-if="success"> <img src="/src/assets/yes.png"/> </span>
      </div>
    </div>

    <!-- 确认 -->
    <div class="row" style="margin-top:20px;">
      <div class="col-xs-3"></div>
      <div class="col-xs-6">
        <el-button type="primary" class="btn btn-block ljbutton" @click="transfer" :loading="loading">确认转账</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      amount: '',
      address: '',
      success: false,
      loading: false,
      errors: {
        amountWrong: false,
        amountEmpty: false,
        addWrong: false,
        addLenErr: false,
        addEmpty: false
      }
    }),
    methods: {
      transfer() {
        if (!this.check()) return
        if (this.deliver.valid < this.amount) {
          this.$message('余额不足！')
          return
        }

        this.loading = true
        this.$store.dispatch('TRANSFER', {
          dest: this.address,
          amount: this.amount,
          assetid: this.deliver.asset
        }).then(i => {
          this.$message.success('转账成功！')
          this.amount = ''
          this.address = ''
          this.loading = false
          this.$emit('success')
        }).catch(e => {
          this.$message.error('转账失败，请重新尝试！')
          this.loading = false
        })
      },

      check() {
        for (let i in this.errors) {
          if (this.errors.hasOwnProperty(i)) this.errors[i] = false
          this.success = false
        }
        if (!this.address) this.errors.addEmpty = true
        if (!this.amount) this.errors.amountEmpty = true
        if (!/^[a|A]/.test(this.address)) this.errors.addWrong = true
        if (this.address.length !== 34) this.errors.addLenErr = true
        if (!this.$_.isNumber(this.amount)) this.errors.amountWrong = true

        for (let i in this.errors) {
          if (this.errors.hasOwnProperty(i)) if (this.errors[i] === true) return false
        }
        this.success = true
        return true
      },
      selectAll(e) {
        setTimeout(function() {
          e.target.select()
        }, 0)
      }
    },
    computed: {
      ...mapGetters(['deliver'])
    }
  }
</script>

<style lang="css">
  .transferModal {
    padding-left: 10px;
    padding-right: 20px
  }
</style>