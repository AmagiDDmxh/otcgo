<template src="./markets.html"></template>
<style lang="stylus" src="./markets.styl" scoped></style>

<script>
  import { mapGetters } from 'vuex'
  import { findBalances } from '../../utils/util'
  import Table from '../../components/common/Table'

  const tableHeader = [{
    label: '类型',
    width: '25%'
  }, {
    label: '委托价格',
    width: '25%'
  }, {
    label: '委托数量',
    width: '25%'
  }, {
    label: '操作',
    width: '25%'
  }]
  const tradeHeader = [{
    label: '卖／买'
  }, {
    label: '数量KAC'
  }, {
    label: '单价ANS'
  }, {
    label: '总价ANS'
  }, {
    label: ''
  }]
  const mytradeHeader = [{
    label: '类型'
  }, {
    label: '成交价格'
  }, {
    label: '成交数量'
  }, {
    label: '总价'
  }, {
    label: '成交时间'
  }]

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
        receiveName: '',
        currency: '',
        type: this.$route.query.class,
        total: 0,
        rate: 0,
        currentPage: 1,
        pageLength: 7,
        ownAsset: {},
        assetId: '',
        sellPlaceHolder: '',
        buyPlaceHolder: '',
        valueId: '',
        myHistoryStatus: false,
        payNum: '', // 买入的数量
        payAnsPrice: '', // 买入的单价
        sellNum: '', // 卖出的数量
        sellAnsPrice: '' // 卖出的价格
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
      ...mapGetters(['loggedIn', 'deliver', 'receive', 'balances']),
      deliverCurrency() {
        switch (this.$route.query.class) {
          case 'kacans':
            return 'KAC'
            break
          case 'lzglzj':
            return 'LZG'
            break
          case 'anscny':
            return 'ANS'
            break
          case 'anccny':
            return 'ANC'
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
            this.sellPlaceHolder = '请输入卖出单价ANS'
            this.buyPlaceHolder = '请输入买入单价ANS'
            return 'ANS'
            break
          case 'lzglzj':
            this.sellPlaceHolder = '请输入卖出单价LZJ'
            this.buyPlaceHolder = '请输入买入单价LZJ'
            return 'LZJ'
            break
          default:
            this.sellPlaceHolder = '请输入卖出单价CNY'
            this.buyPlaceHolder = '请输入买入单价CNY'
            return 'CNY'
        }
      }
    },

    methods: {
      success (type, myHistoryStatus) {
        const success = data => {
          this.tradeDataSource = data.data.reduce(
          (acc, item) => acc.concat({
            type: {
              render: true,
              value: item.ways ? '卖出' : '买入',
              class: item.ways ? 'green-span' : 'red-span'
            },
            price: {
              render: true,
              value: item.price
            },
            amount: {
              render: true,
              value: item.amount
            },
            total: {
              render: true,
              value: `${Number(item.price.match(/\d+(\.\d+)?/)[0]) * Number(item.amount.match(/\d+(\.\d+)?/)[0])}${this.receiveCurrency}`
            },
            time: {
              render: true,
              value: item.time
            }
          }),
          []
        ) || []
        }
        this.$store.dispatch(type, {
          marketId: this.$route.query.class,
          active: 1,
          length: 20
        }).then(data => {
          this.myHistoryStatus = myHistoryStatus
          success(data)
        })
        .catch(err => this.$message.error(JSON.parse(err.bodyText).error))
      },
      getMyHistory () {
        // 获取最新交易
        this.loggedIn
        ? this.myHistoryStatus
        ? this.success('GET_MY_HISTORY_BY_ID', true)
        : this.success('GET_HISTORY_BY_ID', false)
        : window.$router.push({
          name: 'login'
        })
      },
      // 挂买单
      bidAction () {
        this.loggedIn ? this.$store.dispatch('SEND_BID', {
          price: this.payAnsPrice,
          amount: this.payNum,
          assetId: this.ownAsset[0].assetId,
          valueId: this.ownAsset[1].assetId
        })
        .then(data => {
          console.log('%cbidAction: ', 'color: red', data)
          if (data.hasOwnProperty('result') && data.result) {
            this.$message.success('挂买单成功')
          }
          if (data.error) {
            this.$message.warning('挂买单成功')
          }
        }).catch(err => this.$message.error(JSON.parse(err.bodyText).error))
        : window.$router.push({
          name: 'login'
        })
      },

      // 挂卖单
      askAction () {
        this.loggedIn ? this.$store.dispatch('SEND_ASK', {
          price: this.sellAnsPrice,
          amount: this.sellNum,
          assetId: this.ownAsset[0].assetId,
          valueId: this.ownAsset[1].assetId
        })
        .then(data => {
          console.log('%caskAction: ', 'color: red', data)
          if (data.hasOwnProperty('result') && data.result) {
            this.$message.success('挂卖单成功')
          }
          if (data.error) {
            this.$message.warning(data.error)
          }
        }).catch(err => this.$message.error(JSON.parse(err.bodyText).error))
        : window.$router.push({
          name: 'login'
        })
      },

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
        .catch(err => this.$message.error(JSON.parse(err.bodyText).error))
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
        .catch(err => this.$message.error(JSON.parse(err.bodyText).error))
        : window.$router.push({
          name: 'login'
        })
      },

      // 撤销买卖单
      cancel (item) {
        this.loggedIn
        ? this.$store.dispatch('CANCEL', {
          id: item.id.value
        })
        .then(data => {
          this.$message.success('撤销成功')
        })
        .catch(err => this.$message.error(JSON.parse(err.bodyText).error))
        : window.$router.push({
          name: 'login'
        })
      },

      watchChange (to) {
        switch (to.query.class) {
          case 'anscny':
            this.name = '小蚁股'
            this.receiveName ='人民币'
            break
          case 'anccny':
            this.name = '小蚁币'
            this.receiveName ='人民币'
            break
          case 'kacans':
            this.name = '开拍学园币（KAC）'
            this.receiveName ='小蚁股'
            this.receiveCurrency = 'ANS'
            this.deliverCurrency = 'KAC'
            break
          case 'lzglzj':
            this.name = '量子股份'
            this.receiveName = '量子积分'
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

        this.ownAsset = [findBalances(this.balances, this.deliverCurrency.toLocaleLowerCase())[0], findBalances(this.balances, this.receiveCurrency.toLocaleLowerCase())[0]]
        console.log('ownAsset: ', this.ownAsset)
        // 委托单
        this.loggedIn ? this.$store.dispatch('GET_ORDER_BY_ADDRESS').then(data => {
          let ask = data['asks'].reduce(
              (acc, item) => acc.concat({
                id: {
                  render: false,
                  value: item.id,
                  width: '25%'
                },
                type: {
                  render: true,
                  value: '卖出',
                  class: 'green-span',
                  width: '25%'
                },
                price: {
                  render: true,
                  value: item.price,
                  width: '25%'
                },
                amount: {
                  render: true,
                  value: item.amount,
                  width: '25%'
                }
              }),
              []
          )
          let bids = data['bids'].reduce(
              (acc, item) => acc.concat({
                id: {
                  render: false,
                  value: item.id
                },
                type: {
                  render: true,
                  value: '买入',
                  class: 'red-span'
                },
                price: {
                  render: true,
                  value: item.price
                },
                amount: {
                  render: true,
                  value: item.amount
                }
              }),
              []
          )
          this.actionDataSource = ask.concat(bids)
          console.log('actionDataSource: ', this.actionDataSource)
        })
        .catch(err => this.$message.error(JSON.parse(err.bodyText).error)) : []

        // 获取单一市场详情
        this.$store.dispatch('GET_MARKETSBYID', this.$route.query.class).then(data => {
          this.currentPrice = data.price || '0.00'
          this.totalTrade = data.volumnOfLast24Hours || '0.00'
          this.rate = Number(data.rate).toFixed(4) * 100 
          console.log('GET_PRICEBYID: ', data)
        })
        .catch(err => this.$message.error(JSON.parse(err.bodyText).error))


        // 获取最新交易
        this.success('GET_HISTORY_BY_ID', false)

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
            .catch(err => this.$message.error(JSON.parse(err.bodyText).error))
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
