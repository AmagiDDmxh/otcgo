<template src="./markets.html"></template>
<style lang="stylus" src="./markets.styl"></style>

<script>
  export default {
    data() {
      return {
        buyList: [
          { name: '买一' },
          { name: '买二' },
          { name: '买三' },
          { name: '买四' },
          { name: '买五' },
          { name: '买六' },
          { name: '买七' },
          { name: '买八' },
          { name: '买九' },
          { name: '买十' }
        ],  // 买单列表
        sellList: [
          { name: '卖一' },
          { name: '卖二' },
          { name: '卖三' },
          { name: '卖四' },
          { name: '卖五' },
          { name: '卖六' },
          { name: '卖七' },
          { name: '卖八' },
          { name: '卖九' },
          { name: '卖十' }
        ],  // 卖单列表
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
          const softBids = data['bids'].sort((c, p) => c.price - p.price)
          const softAsks = data['asks'].sort((c, p) => p.price - c.price)

          this.sellList = this.sellList.reverse().map(({ name }, index) => ({
            name,
            price: typeof softAsks[index] === 'undefined' ? NaN : softAsks[index].price,
            amount: typeof softAsks[index] === 'undefined' ? NaN : softAsks[index].amount
          }))

          this.buyList = this.buyList.map(({ name }, index) => ({
            name,
            price: typeof softBids[index] === 'undefined' ? NaN : softBids[index].price,
            amount: typeof softBids[index] === 'undefined' ? NaN : softBids[index].amount
          }))

          let amountArray = [];
          for (let i = 0; i < this.buyList.length; i++) {
            amountArray.push(this.buyList[i]['amount'] || 0);
          }
          for (let i = 0; i < this.sellList.length; i++) {
            amountArray.push(this.sellList[i]['amount'] || 0);
          }
          this.amountMax = amountArray.max();
        }, (response) => {
          this.$message.error('获取集市买(卖)单错误');
          throw response;
        });
      }
    },

    mounted: function () {
      this.name = this.$route.query['class'] === 'anscny' ?  '小蚁股' : '小蚁币'
      this.get_rder_book(this.$route.query['class'])
    }
  }
</script>
