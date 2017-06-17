<template src="./markets.html"></template>
<style lang="stylus" src="./markets.styl" scoped></style>

<script>
  import { mapGetters } from 'vuex'
  import Table from '../../components/common/Table'

  const tableHeader = ['类型', '委托价格', '委托数量', '操作']
  const tradeHeader = ['卖／买', '数量KAC', '单价ANS', '总价ANS', '']
  const mytradeHeader = ['类型', '成交价格', '成交数量', '总价', '成交时间']

  export default {
    components: {
      'table-container': Table
    },
    data() {
      return {
        mytradeHeader: mytradeHeader,
        tradeHeader: tradeHeader,
        tableHeader: tableHeader,
        totalTrade: '0.00', // 24小时成交量
        currentPrice: '0.00', // 当前价
        mytradeDataSource: [], // 我的交易记录
        tradeDataSource: [], // 最新交易
        actionDataSource: [], // 用户操作列表
        bills: [],  // 买单列表
        orders: [],  // 卖单列表
        amountMax: 0,
        name: '',
        currency: '',
        type: this.$route.query.class,
        total: 0,
        currentPage: 1,
        pageLength: 7,
        payNum: '', // 买入的数量
        payAnsPrice: '', // 买入的单价
        sellNum: '', // 买卖出的数量
        sellAnsPrice: '' // 卖出的数量
      }
    },

    watch: {
      '$route' (to, from) {
        if (to.path === '/markets')
          this.watchChange(to)
        else this.$destroy()
      }
    },

    computed: {
      ...mapGetters(['loggedIn', 'deliver', 'receive']),
      deliverCurrency() {
        switch (this.$route.query.class) {
          case 'kacans':
            return 'KAC'
            break
          case 'lzglzj':
            return 'LZG'
            break
          default:
            return 'KAC'
        }
      },
      totoalMoney () {
        return this.payNum * this.payAnsPrice
      },
      totoalSellMoney () {
        return this.sellNum * this.sellAnsPrice
      },
      receiveCurrency() {
        switch (this.$route.query.class) {
          case 'kacans':
            return 'ANS'
            break
          case 'lzglzj':
            return 'LZJ'
            break
          default:
            return 'ANS'
        }
      }
    },

    methods: {

      buyOrder (items) {
        this.loggedIn ? this.$store.dispatch('SEND_FREE_BID', {
          id: items.id.value
        })
        .then(data => {
          console.log('buy: ', data)
          if (data.hasOwnProperty('result') && data.result) {
            this.$message.success('买入成功')
          }
        })
        .catch(err => this.$message.error('交易失败'))
        : window.$router.push({
          name: 'login'
        })
      },
      sellOrder (items) {
        this.loggedIn ? this.$store.dispatch('SEND_FREE_ASK', {
          id: items.id.value
        })
        .then(data => {
          if (data.hasOwnProperty('result') && data.result) {
            this.$message.success('卖出成功')
          }
        })
        .catch(err => this.$message.error('交易失败'))
        : window.$router.push({
          name: 'login'
        })
      },
      // 撤销买卖单
      cancel (item) {
        console.log('%c撤销单：', item)
      },
      watchChange (to) {
        switch (to.query.class) {
          case 'anscny':
            this.name = '小蚁股'
            break
          case 'anccny':
            this.name = '小蚁币'
            break
          case 'kacans':
            this.name = '开拍学园币（KAC）'
            this.receiveCurrency = 'ANS'
            this.deliverCurrency = 'KAC'
            break
          case 'lzglzj':
            this.name = '量子股份'
            this.receiveCurrency = 'LZJ'
            this.deliverCurrency = 'LZG'
            break
        }
        this.type = to.query.class

        if (to.path === '/markets')
          this.getOrderBook(this.type)
      },

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
        
        // 交易记录
        // this.loggedIn ? this.$store.dispatch('GET_REDEEM').then(data => {
        //   this.mytradeDataSource = data.data
        //   console.log('GET_REDEEM: ', data)
        // })
        // .catch(err => this.$message.error('获取交易记录失败')) : []

        // 委托单
        this.loggedIn ? this.$store.dispatch('GET_ORDER_BY_ADDRESS').then(data => {
          this.actionDataSource = data['asks'].reduce(
              (acc, item) => acc.concat({
                id: {
                  render: false,
                  value: item.id
                },
                price: {
                  render: true,
                  value: item.price
                },
                amount: {
                  render: true,
                  value: item.amount
                },
                type: {
                  render: false,
                  value: 'asks'
                }
              }),
              []
          )
          console.log('actionDataSource: ', this.actionDataSource)
        })
        .catch(err => this.$message.error('获取委托单失败')) : []
        
        // 获取最新成交价
        this.$store.dispatch('GET_PRICEBYID', this.$route.query.class).then(data => {
          this.currentPrice = data.price || '0.00'
          this.totalTrade = data.volumnOfLast24Hours || '0.00'
          console.log('GET_PRICEBYID: ', data)
        })
        .catch(err => this.$message.error('获取交易记录失败'))

        return this.$store.dispatch('GET_MARKETS', { name, params })
            .then(d => {
              this.total = d['item_num']

              this.orders = d.data['asks'].reduce(
                  (acc, item) => acc.concat({
                    id: {
                      render: false,
                      value: item.id
                    },
                    amount: {
                      render: true,
                      value: item.amount
                    },
                    price: {
                      render: true,
                      value: item.price
                    },
                    total: {
                      render: true,
                      value: item.price * item.amount
                    }
                  }),
                  []
              )
              this.bills = d.data['bids'].reduce(
                  (acc, item) => acc.concat({
                    id: {
                      render: false,
                      value: item.id
                    },
                    amount: {
                      render: true,
                      value: item.amount
                    },
                    price: {
                      render: true,
                      value: item.price
                    },
                    total: {
                      render: true,
                      value: item.price * item.amount
                    }
                  }),
                  []
              )
              return d
            })
            .catch(r => {
              this.$message.error('获取集市买(卖)单错误')
            })
      },
      // remove
      purchase({ total, id }) {
        if (!this.loggedIn) {
          this.$message.error('购买前请先确认登陆！')
          return
        }
        this.$store.commit('SET_DELIVER', this.$route.query.class.slice(0, 3))
        this.$store.commit('SET_RECEIVE', this.$route.query.class.slice(3))

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
      this.watchChange(this.$route)
      this.marketsTimer = window.setInterval(() => this.getOrderBook(this.type), 1000 * 2)
    },

    destroyed() {
      window.clearInterval(this.marketsTimer)
    }
  }
</script>
