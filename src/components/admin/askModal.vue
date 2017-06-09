<template lang="pug" src="./askModal.pug"></template>
<style lang="css" scoped>
  .error-area {
    padding-left: 0;
  }
  .error-text {
    text-indent: 0;
  }

  .btn-lj-green,
  .btn-lj-green:hover,
  .btn-lj-green:focus{
    background-color: #669a00;
    border-color: #669a00;
    color: #fff;
  }
</style>

<script>
  import { mapGetters } from 'vuex'
  import { img } from '~utils/config'

  import { required } from 'vuelidate/lib/validators'
  import { withParams, req } from 'vuelidate/lib/validators/common'

  export default {
    data: () => ({
      img,
      price: {
        value: '',
        lenErr: false,
        empty: false,
        wrong: false,
        success: false
      },
      amount: {
        value: 0,
        lenErr: false,
        empty: false,
        wrong: false,
        invalid: false,
        success: false,
        totalWrong: false
      },
      loading: false
    }),
    computed: {
      ...mapGetters(['deliver', 'receive'])
    },

    methods: {
      async transfer() {
        if (!this.checkAmount() || !this.checkPrice()) return
        this.loading = true
        try {
          const price = this.price.value
          const amount = this.amount.value
          let res = await this.$store.dispatch('ASK', { price, amount })
          if (res) {
            this.$message.success('挂单成功!')
            this.loading = false
            this.$store.dispatch('GET_ASSET')

            this.$set(this.amount, 'value', '')
            this.$set(this.amount, 'success', false)

            this.$set(this.price, 'value', '')
            this.$set(this.price, 'success', false)
            this.$emit('success')
          }
        } catch(e) {
          this.$message.error(e.body.error)
          this.loading = false
          this.$store.dispatch('GET_ASSET')
        }
      },
      checkAmount() {
        for (const i in this.amount) {
          if (this.amount.hasOwnProperty(i) && i !== 'value') this.amount[i] = false
        }
        const amountStr = String(this.amount.value)
        const amountNum = Number(this.amount.value)
        if (amountStr.indexOf('.') > -1) {
          this.$set(this.amount, 'value', Number(
              amountStr.trim().slice(0, amountStr.indexOf('.') + 9))
          )
        }

        if (!amountStr) this.amount.empty = true
        if (amountNum > Number(this.deliver.valid)) this.amount.invalid = true
        if (!this.$_.isNumber(amountNum) || amountNum === 0) this.amount.wrong = true
        if (amountStr.slice(amountStr.indexOf('.')).length > 9) this.amount.lenErr = true

        for (const i in this.amount) {
          if (this.amount.hasOwnProperty(i) &&
              this.amount[i] === true &&
              i !== 'value') return false
        }

        this.amount.success = true
        return true
      },

      checkPrice() {
        for (const i in this.price) {
          if (this.price.hasOwnProperty(i) && i !== 'value') this.price[i] = false
        }
        const priceStr = String(this.price.value)
        const priceNum = Number(this.price.value)
        this.price.value = priceNum
        if (priceStr.indexOf('.') > -1) {
          this.$set(this.price, 'value', Number(
              priceStr.trim().slice(0, priceStr.indexOf('.') + 9))
          )
        }

        if (!priceStr) this.price.empty = true
        if (!this.$_.isNumber(priceNum) || priceNum <= 0) this.price.wrong = true
        if (priceStr.slice(priceStr.indexOf('.')).length > 9) this.price.lenErr = true
        if (!this.receive['divisible']){
          const total = this.price.value * this.amount.value
          if (!this.$_.isInteger(total)) {
            this.price.totalWrong = true
            return false
          }
        }

        for (const i in this.price) {
          if (this.price.hasOwnProperty(i) &&
              this.price[i] === true &&
              i !== 'value') return false
        }

        this.price.success = true
        return true
      },

      selectAll(e) {
        setTimeout(() => e.target.select(), 0)
      }
    }
  }
</script>
