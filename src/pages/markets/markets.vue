<template src="./markets.html"></template>
<style lang="stylus" src="./markets.styl"></style>

<script>
  import { mapMutations } from 'vuex'

  export default {
    data() {
      return {
        bills: [],  // 买单列表
        orders: [],  // 卖单列表
        amountMax: 0,
        name: "",
        asset: this.$store.state.asset
      }
    },
    watch: {
      '$route' (to, from) {
        this.name = this.$route.query.class === 'anscny' ? '小蚁股' : '小蚁币'
        this.get_rder_book(to.query.class);
      }
    },
    computed: {
      isLoggedIn() {
        return this.$store.getters['isLoggedIn']
      }
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
      purchase({total, id}) {
        this.$msgbox({
          title: '提示',
          message: `您将要购买${total}元的${this.name}?是否确认下单!`,
          showCancelButton: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              if (this.isLoggedIn) {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '执行中...';
                this.$store.dispatch('CHECKOUT', {id, hex_pubkey: window.LJWallet['publicKey']}).then((r) => {
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
                done()
                this.$message.error('购买前请先确认登陆！')
              }
            } else {
              done();
            }
          }
        })
        // this.$store.dispatch('CHECKOUT', {id, hex_pubkey: window.LJWallet['publicKey']})
      }
    },
    mounted() {
      this.name = this.$route.query['class'] === 'anscny' ? '小蚁股' : '小蚁币'
      this.get_rder_book(this.$route.query['class'])
      window.timer = window.setInterval(() => this.get_rder_book(this.$route.query['class']), 1000 * 2)
    },
    destroyed() {
      window.clearInterval(window.timer)
    }
  }
</script>


