<template>
  <div class="obligation">
    <table class="table data-table table-bordred table-striped">
      <thead>
      <th>资产类型 </th>
      <th>购买数量</th>
      <th>购买单价/CNY</th>
      <th>总计/CNY</th>
      <th class="tb-btn">
      </th>
      </thead>
      <tbody>
      <tr v-for="item in listData">
        <td>{{item.name}}</td>
        <td>{{item.amount}}</td>
        <td>{{item.price}}</td>
        <td>
          {{item.price * item.amount}}
        </td>
        <td style="width:330px">
          <template v-if="settled === 0">
            <button class="btn ljbutton" v-on:click="settleAccounts">结算</button>
          </template>
          <div v-if="settled === 1">
            <span class="settled-icon">
              <img src="../../../assets/yes.png"/>
            </span>
            <span style="font-size:12px"> 结算成功！几秒后可在资产列表中查询。</span>
          </div>
          <div v-if="settled === -1">
            <span style="font-size:13px"> 你的账户人民币不足，请<a href="#">充值</a>！</span>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  export default {

    data() {
      return {
        settled: -1,
        listData: Array
      }
    },
    methods: {
      getorders: function () {
        this.$http.get(`order/${window.LJWallet.address}/`).then((response) => {
          this.listData = response.data.asks;
        }, (response) => {
          console.log(response);
        })
      },
      settleAccounts: function (event) {
        this.settled = 1;
      },
      transactionAJAX: function (num, price, type) {
        var self = this;

        var postData = {
          assetid: self.assetId,
          price: price,
          amount: num,
          client: window.LJWallet.publicKeyCompressed,
          way: type,
          valueassetid: self.valueassetid,
          hex_pubkey: window.LJWallet.publicKey
        }
        // 交易步骤1:
        this.$http.post('order/', postData, {
          emulateHTTP: true,
          emulateJSON: true
        }).then((response) => {
          var postData2 = {};
          postData2.signature = ljSign(window.LJWallet['privateKey'], response.data.transaction);
          postData2.id = response.data.order.id;
          // 交易步骤2：
          self.$http.get('nonce/').then((response) => {
            postData2.nonce = response.data.nonce;
            // 交易步骤3： (post->sign : 接口有问题 )
            self.$http.post('sign/', postData2, {
              emulateHTTP: true,
              emulateJSON: true
            }).then((response) => {
              console.log('交易步骤3->debug:', response);
              self.$message.success('[点击F12查看console拥有txid的保存数据] 转账成功！txid:' + response.body.txid);
              console.log(response.body.txid);
              self.dialogTransaction = false;
            }, (response) => {
              console.log('交易步骤3->debug:', response);
              self.$message.error('交易失败！ :' + response.body.non_field_errors[0]);
              self.dialogTransaction = false;
            })
          }, (response) => {
            self.$message.error('交易失败！');
            self.dialogTransaction = false;
            throw response;
          });

        }, (response) => {
          self.$message.error('交易失败！');
          self.dialogTransaction = false;
          throw response;
        });

      }
    },
    mounted() {
      this.getorders();
    }
  }
</script>
<style lang="css">
  .obligation {
  }
</style>
