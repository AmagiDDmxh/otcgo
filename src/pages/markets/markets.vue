<template src="./markets.html"></template>
<style lang="stylus" src="./markets.styl" scoped></style>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        bills: [],  // 买单列表
        orders: [],  // 卖单列表
        amountMax: 0,
        name: '',
        currency: '',
        type: this.$route.query.class,
        total: 0,
        currentPage: 1,
        pageLength: 7
      }
    },

    watch: {
      '$route' (to, from) {
        this.name = this.$route.query.class === 'anscny' ? '小蚁股' : this.$route.query.class === 'anccny' ? '小蚁币' : '开拍币'
        this.type = to.query.class
        this.getOrderBook(this.type)
      }
    },

    computed: {
      ...mapGetters(['loggedIn', 'deliver', 'receive']),
      deliverCurrency() {
        if (this.deliver.marketId) {
          return ` ${this.deliver.marketSign.toUpperCase()}`
        }
        return ' KAC'
      },
      receiveCurrency() {
        if (this.receive.marketId) {
          return ` ${this.receive.marketSign.toUpperCase()}`
        }
        return ' ANS'
      }
    },

    methods: {
      handleSizeChange(val) {
        this.pageLength = val
        this.getOrderBook(this.type)
      },

      handleCurrentChange(val) {
        this.currentPage = val
        this.getOrderBook(this.type)
      },

      getOrderBook(name) {
        const params = {
          active: this.currentPage,
          length: this.pageLength
        }

        return this.$store.dispatch('GET_MARKETS', { name, params })
            .then(d => {
              this.total = d['item_num']

              this.orders = d.data['asks'].reduce(
                  (acc, item) => acc.concat({
                    id: item.id,
                    price: item.price,
                    amount: item.amount,
                    total: item.price * item.amount
                  }),
                  []
              )
              return d
            })
            .catch(r => {
              this.$message.error('获取集市买(卖)单错误')
            })
      },
      purchase({ total, id }) {
        if (!this.loggedIn) {
          this.$message.error('购买前请先确认登陆！')
          return
        }

        this.$store.commit('SET_DELIVER', '开拍学园币（KAC）')
        this.$store.commit('SET_RECEIVE', '小蚁股')

        this.$store.dispatch('GET_ASSET')

        this.$msgbox({
          title: '提示',
          message: `您将要购买总价${total}${this.receive.marketSign.toUpperCase()}的${this.name}，当前${this.receiveCurrency}可用余额为${this.receive.valid}是否确认下单？`,
          showCancelButton: true,
          beforeClose: async (action, instance, done) => {
            instance.confirmButtonLoading = false

            if (action === 'confirm') {
              if (this.receive.valid < total) {
                this.$message.warning(`${this.receive.name}余额不足，请进行充值！`)
                done()
                return
              }
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              try {
                let res = await this.$store.dispatch('BID', {id, name: this.$route.query.class})
                if (res.result) {
                  this.$message.success('交易发起成功，请等待验收！')
                  this.getOrderBook(this.type)
                  done()
                  instance.confirmButtonLoading = false
                } else {
                  this.$message.error('交易失败，请稍候再试。')
                  done()
                  this.getOrderBook(this.type)
                }
              } catch(e) {
                this.$message.error('交易失败，请稍候再试。')
                this.getOrderBook(this.type)
                instance.confirmButtonLoading = false
                done()
              }
            } else {
              done()
            }
          }
        })
      }
    },

    mounted() {
      this.name = this.$route.query.class === 'anscny' ? '小蚁股' : this.$route.query.class === 'anccny' ? '小蚁币' : '开拍币'
      this.currency = this.$route.query.class === 'kacans' ? 'ANS' : 'CNY'
      this.getOrderBook(this.type)
      window.marketsTimer = window.setInterval(() => this.getOrderBook(this.type), 1000 * 2)
    },

    destroyed() {
      window.clearInterval(this.marketsTimer)
    }
  }
</script>
