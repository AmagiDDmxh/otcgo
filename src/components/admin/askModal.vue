<template lang="pug" src="./askModal.pug"></template>
<style lang="css" scoped>
  .error-area {
    padding-left: 0;
  }
  .error-text {
    text-indent: 0;
  }
  .btn-lj-gree:hover {
    background-color: #669a00;
    color: #fff;
  }
</style>

<script>
  import { mapGetters } from 'vuex'
  import { img } from '~utils/config'
  import { required } from 'vuelidate/lib/validators'

  import { withParams, req } from 'vuelidate/lib/validators/common'

  const decimal = decimal => withParams({ type: 'decimal', decimal },
      function() {

      })


  export default {
    data: () => ({
      img,
      price: '',
      amount: '',
      loading: false,
      success: false,
      errorCleaner: false,
      errors: {}
    }),
    computed: {
      ...mapGetters(['deliver', 'receive'])
    },

    validations: {
      amount: {
        required,
        decimal
      }
    },

    methods: {
      async transfer() {
        if (!this.check()) return
        this.loading = true
        try {
          const price = this.price
          const amount = this.amount
          let res = await this.$store.dispatch('ASK', { price, amount })
          if (res) {
            this.$message.success('交易成功!')
            this.loading = false
            this.$store.dispatch('GET_ASSET')
            this.amount = this.price = ''
            this.$emit('success')
          }
        } catch(e) {
          this.$message.error('服务器有点忙，请稍候重试！')
          this.loading = false
          this.$store.dispatch('GET_ASSET')
        }
      },
      check() {
        for (let i in this.errors) {
          if (this.errors.hasOwnProperty(i)) this.errors[i] = false
        }

        const amountStr = String(this.amount)
        const priceStr = String(this.price)
        this.amount = Number(amountStr.trim().slice(0, amountStr.indexOf('.') + 9))
        this.price = Number(priceStr.trim().slice(0, priceStr.indexOf('.') + 9))

        if (!this.price) this.errors.priceEmpty = true
        if (!this.amount) this.errors.amountEmpty = true
        if (this.amount > Number(this.deliver.valid)) this.errors.amountInvalid = true
        if (!this.$_.isNumber(this.amount)) this.errors.amountWrong = true
        if (!this.$_.isNumber(this.price)) this.errors.priceWrong = true
        if (amountStr.slice(amountStr.indexOf('.')).length > 9) this.errors.amountLenErr = true
        if (priceStr.slice(priceStr.indexOf('.')).length > 9) this.errors.priceLenErr = true
        if (!this.receive['divisible']) if (!this.$_.isInteger(this.price * this.amount)) this.errors.totalWrong = true

        for (let i in this.errors) {
          if (this.errors[i] === true) return false
        }
        this.success = true
        return true
      },

      selectAll(e) {
        setTimeout(() => e.target.select(), 0)
      }
    }
  }
</script>
