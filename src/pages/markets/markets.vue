<template src="./markets.html"></template>
<style lang="stylus" src="./markets.styl"></style>

<script>
  let timer;

  export default {
    data() {
      return {
        buyList: [],  // 买单列表
        sellList: [],  // 卖单列表
        amountMax: 0,
        name: ""
      }
    },
    watch: {
      '$route' (to, from) {
        this.name = this.$route.query.class === 'anscny' ? '小蚁股' : '小蚁币'
        this.get_rder_book(to.query.class);
      }
    },
    methods: {
      get_rder_book(type) {
        Array.prototype.max = function () {
          return Math.max.apply({}, this)
        };
        this.$http.get(`order_book/${ type }/`).then(({ data }) => {
          this.buyList = data['bids'];
          this.sellList = data['asks'];
        }, (response) => {
          this.$message.error('获取集市买(卖)单错误');
          throw response;
        });
      },
      purchase() {
        this.$router.push('/admin/obligation');
      }
    },

    mounted() {
      this.name = this.$route.query['class'] === 'anscny' ? '小蚁股' : '小蚁币'
      this.get_rder_book(this.$route.query['class'])
      timer = window.setInterval(() => this.get_rder_book(this.$route.query['class']), 1000 * 2)
    },
    destroyed() {
      window.clearInterval(timer)
    }
  }
</script>
