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
        type: this.$route.query.class
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
      ...mapGetters(['loggedIn', 'deliver'])
    },

    methods: {
      getOrderBook(name) {
        this.$store.dispatch('GET_MARKETS', name)
            .then(d => { this.orders = d })
            .catch(r => this.$message.error('获取集市买(卖)单错误'))
      },
      purchase({ total, id }) {
        if (!this.loggedIn) {
          this.$message.error('购买前请先确认登陆！')
          return
        }
        this.$store.commit('SET_DELIVER', '小蚁股')
        this.$store.dispatch('GET_ASSET')

        this.$msgbox({
          title: '提示',
          message: `您将要购买总价${total}元的${this.name}，当前ANS可用余额为${this.deliver.valid}是否确认下单？`,
          showCancelButton: true,
          beforeClose: async (action, instance, done) => {
            instance.confirmButtonLoading = false

            if (action === 'confirm') {
              if (this.deliver.valid < total) {
                this.$message.warning(`${this.deliver.name}余额不足，请进行充值！`)
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
                  this.$message('此次交易失败，可能已被抢单！')
                  done()
                  this.getOrderBook(this.type)
                }
              } catch(e) {
                this.$message('此次交易失败，可能已被抢单！')
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
      window.clearInterval(window.marketsTimer)
    }
  }
</script>
