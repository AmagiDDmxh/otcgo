<template src="./markets.html"></template>
<style lang="stylus" src="./markets.styl"></style>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        bills: [],  // 买单列表
        orders: [],  // 卖单列表
        amountMax: 0,
        name: "",
        currency: ""
      }
    },
    watch: {
      '$route' (to, from) {
        this.name = this.$route.query.class === 'anscny' ? '小蚁股' : this.$route.query.class === 'anccny' ? '小蚁币' : '开拍币'
        this.get_rder_book(to.query.class);
      }
    },
    computed: {
      ...mapGetters(['asset', 'loggedIn'])
    },
    methods: {
      get_rder_book(type) {
        this.$http.get(`order_book/${ type }/`).then(({ data }) => {
          this.orders = data['asks'].reduce(
            (acc, item) => acc.concat({
              id: item.id,
              price: item.price,
              amount: item.amount,
              total: item.price * item.amount
            }),
            []
          );
        }, (response) => {
          this.$message.error('获取集市买(卖)单错误');
          throw response;
        });
      },
      purchase({total, id}, name) {
        this.$msgbox({
          title: '提示',
          message: `您将要购买${total}元的${this.name}，是否确认下单？`,
          showCancelButton: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              if (!this.loggedIn) {
                this.$message.error('购买前请先确认登陆！')
                done()
                return
              }

              if (name === '开拍币') {
                if (this.asset.ansAsset['valid'] < total) {
                  this.$message.warning('小蚁股余额不足，请进行充值！')
                  done()
                  return
                }
              } else {
                if (this.asset.rmbAsset['valid'] < total) {
                  this.$message.warning('人民币余额不足，请进行充值！')
                  done()
                  return
                }
              }
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              this.$store.dispatch('PURCHASE', {id, hex_pubkey: window.LJWallet['publicKey']}).then((r) => {
                if (r.data.result) {
                  this.$message.success('交易发起成功，请等待验收！')
                } else {
                  this.$message('此次交易失败，可能已被抢单！')
                }
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              });
            } else {
              done();
            }
          }
        })
      }
    },
    mounted() {
      this.name = this.$route.query.class === 'anscny' ? '小蚁股' : this.$route.query.class === 'anccny' ? '小蚁币' : '开拍币'
      this.currency = this.$route.query.class === 'kacans' ? 'ANS' : 'CNY'
      this.get_rder_book(this.$route.query['class'])
      window.timer = window.setInterval(() => this.get_rder_book(this.$route.query['class']), 1000 * 2)
    },
    destroyed() {
      window.clearInterval(window.timer)
    }
  }
</script>


