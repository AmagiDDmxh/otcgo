<template>

</template>
<script>
  export default {
    data() {
      return {
        // dialog
        dialogPay: false,
        dialogDisPay: false,
        dialogTransfer: false,
        dialogTransaction: false,
        balances: [],
        // common
        valueassetid: "",
        assetId: "",
        divisible: false,
        // 列表
        current_price: "",
        transfer_name: "",
        transfer_valid: "",

        // 交易
        buyNumValue: "",
        buyPriceValue: "",
        sellNumValue: "",
        sellPriceValue: "",
        // 转账
        transfer_num: "",
        transfer_address_value: "",
        transfer_err: false,

        // 充值
        rechangeValue: "",
        rechangeState: 0,
        // 提现
        fetchValue: "",
        alipay_account_name: "",
        alipay_account: "",
        fetchState: 0,
        confirmInfo: {}
      }
    },
    methods: {
      getbalances: function () {

        var loading = this.$loading({
          fullscreen: true,
          text: "正在获取资产列表..."
        });
        this.$http.head
        this.$http.get('balances/' + window.LJWallet.address + '/').then((response) => {
          this.balances = response.data.balances;
          this.valueassetid = response.data.balances[0].asset;
          loading.close();
        }, (response) => {
          loading.close();
        });
      },

      openPay: function () {
        this.dialogPay = true;
        this.rechangeState = 0;
        this.rechangeValue = "";

      },
      openFetch: function () {
        this.dialogDisPay = true;
        this.fetchState = 0;
        this.fetchValue = "";
        this.alipay_account_name = "";
        alipay_account = "";

      },
      balanceTransaction: function (asset, divisible, current_price) {
        this.dialogTransaction = true;
        this.assetId = asset;
        this.divisible = divisible;
        this.current_price = current_price
      },

      transactionAJAX: function (num, price, type) {
        /*num:数量,price:价格,type:操作类型(false:买,true:卖)*/
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
              self.$message.success('转账成功！txid:' + response.body.txid);
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

      },
      buy: function () {
        if (this.buyNumValue == '' || this.buyPriceValue == '') {
          return;
        }
        /*资产是否可分割*/
        if (this.divisible) {
          this.buyNumValue = Number(this.buyNumValue).toFixed(4);
          this.buyPriceValue = Number(this.buyPriceValue).toFixed(4);
        } else {
          this.buyNumValue = Math.floor(this.buyNumValue)
          this.buyPriceValue = Math.floor(this.buyPriceValue)
        }
        ;
        this.transactionAJAX(this.buyNumValue, this.buyPriceValue, false);

      },
      sell: function () {

        if (this.sellNumValue == '' || this.sellPriceValue == '') {
          return;
        }
        /*资产是否可分割*/
        if (this.divisible) {
          this.sellNumValue = Number(this.sellNumValue).toFixed(4);
          this.sellPriceValue = Number(this.sellPriceValue).toFixed(4);
        } else {
          this.sellNumValue = Math.floor(this.sellNumValue)
          this.sellPriceValue = Math.floor(this.sellPriceValue)
        }
        ;
        this.transactionAJAX(this.sellNumValue, this.sellPriceValue, true);

      },
      balanceTransfer: function (asset, divisible, name, valid) {
        this.assetId = asset;
        this.transfer_name = name;
        this.transfer_valid = valid;
        this.divisible = divisible;
        this.dialogTransfer = true;
      },
      transfer: function () {
        var self = this;
        var address_value = $.trim(self.transfer_address_value);
        if (self.transfer_num == "" || self.transfer_address_value == "") {
          return;
        }
        // 转账地址校验
        if ((address_value[0] == 'a' || address_value[0] == 'A') && address_value.length == 34) {
          postAjax(self);
        } else {
          return;
        }

        function postAjax(self) {
          self.transfer_address_err = false;
          if (self.divisible) {
            self.transfer_num = Number(self.transfer_num).toFixed(4);
          } else {
            self.transfer_num = Math.floor(self.transfer_num)
          }

          var loading = self.$loading({
            fullscreen: true
          });
          var postData = {
            dest: self.transfer_address_value,
            source: window.LJWallet.address,
            amount: self.transfer_num,
            compressed_pubkey: window.LJWallet.publicKeyCompressed,
            assetid: self.assetId,
            hex_pubkey: window.LJWallet.publicKey
          }
          /*转账步骤1*/
          self.$http.post('balances/transfer/', postData, {
            emulateHTTP: true,
            emulateJSON: true
          }).then((response) => {
            /*转账步骤2*/
            var postData = response.data;
            postData.signature = ljSign(window.LJWallet.privateKey, postData.transaction);
            delete postData.transaction;

            // console.log('*转账步骤2*', postData)

            self.$http.get('nonce/').then((response) => {
              postData.nonce = response.data.nonce;
              // console.log('*转账步骤3*', postData)

              self.$http.post('sign/', postData, {
                emulateHTTP: true,
                emulateJSON: true
              }).then((response) => {
                self.$message.success('转账成功！txid:' + response.body.txid);
                self.transfer_address_value = "";
                self.transfer_num = "";
                loading.close();
                self.dialogTransfer = false;

              }, (response) => {
                self.$message.error('转账失败,请重试! txid:' + response.body.txid);
                self.transfer_address_value = "";
                self.transfer_num = "";
                loading.close();
                self.dialogTransfer = false;

              });

            }, (response) => {
              self.$message.error('转账失败,请重试！');
              self.transfer_address_value = "";
              self.transfer_num = "";
              loading.close();
              self.dialogTransfer = false;
              throw response;
            })

          }, (response) => {
            self.$message.error('转账失败,请重试！');
            self.transfer_address_value = "";
            self.transfer_num = "";
            loading.close();
            self.dialogTransfer = false;
            throw response;
          });
        }

      },

      rechange: function () {

        // 充值
        var self = this;
        if (self.rechangeValue == '' || self.rechangeValue < 100) {
          return;
        }
        self.$http.get('nonce/').then((response) => {

          var postdata = {};
          postdata.nonce = response.data.nonce;
          var signature = ljSign(window.LJWallet.privateKey, response.data.nonce);
          postdata.signature = signature;
          postdata.value = self.rechangeValue;
          postdata.hex_pubkey = window.LJWallet.publicKey;
          postdata.address = window.LJWallet.address;

          self.$http.post('recharge/', postdata, {
            emulateHTTP: true,
            emulateJSON: true
          }).then((response) => {
            self.rechangeState = 1;
          }, (response) => {
            self.$message.error('充值失败,请重试！' + response.data.non_field_errors);
          });

        }, (response) => {

          self.$message.error('充值失败,请重试！')
        })

      },
      fetch: function () {
        // 提现
        var self = this;
        if (self.fetchValue == "" || self.alipay_account_name == "" || self.alipay_account == "") {
          return;
        }

        self.$http.get('nonce/').then((response) => {

          var postdata = {};
          postdata.nonce = response.data.nonce;
          var signature = ljSign(window.LJWallet.privateKey, response.data.nonce);
          postdata.signature = signature;
          postdata.value = self.fetchValue;
          postdata.hex_pubkey = window.LJWallet.publicKey;
          postdata.address = window.LJWallet.address;
          postdata.alipay_account_name = self.alipay_account_name;
          postdata.alipay_account = self.alipay_account;

          self.$http.post('withdraw/', postdata, {
            emulateHTTP: true,
            emulateJSON: true
          }).then((response) => {
            self.fetchState = 1;
            self.confirmInfo = response.data;

          }, (response) => {
            self.$message.error('提现失败,请重试！' + response.data.non_field_errors);
          });

        }, (response) => {

          self.$message.error('提现失败,请重试！')
        })

      },

      confirmfn: function () {
        var self = this;
        var signature1 = ljSign(window.LJWallet.privateKey, this.confirmInfo.transaction);
        var posd = {};
        posd.no = this.confirmInfo.no;
        posd.signature = signature1;

        this.$http.post('signature/withdraw/', posd, {
          emulateHTTP: true,
          emulateJSON: true
        }).then((response) => {
          self.fetchState = 2;
        }, (response) => {
          self.$message.error('提现失败,请重试！' + response.data.non_field_errors);
        });
      },

      // Check out the transfer value when keyup
      checkOutKeyValue: function (transfer_num) {
        return isNaN(parseInt(transfer_num))
      }

    },
    mounted: function () {
      this.getbalances();
      setInterval(this.getbalances, 1000 * 60 * 20)
    }

  };
</script>
<style lang="css">
  .blue-span {
    color: #009cfd;
  }

  .tiny-dialog > div {
    width: 544px;
  }

  /*data-table */

  .data-table th {
    height: 41px;
    background: #eeeeee;
    border-top: #ccc 1px solid;
    border-bottom: #ccc 1px solid;
  }

  .tb-btn {
    width: 240px;
  }

  .data-table th,
  .data-table td {
    text-align: center;
  }

  .data-table td {
    height: 60px;
    line-height: 60px !important;
    color: #8c8c8c;
  }

  .ljbutton {
    background: #009cff;
    color: #fff;
  }

  .ljbutton:hover {
    color: #fff !important;
  }

  .dialog-shuoming {
    width: 100%;
    border-top: 1px solid #ccc;
    margin-top: 30px;
  }

  .dialog-shuoming p {
    color: #999;
    margin-bottom: 0px;
    margin-top: 5px;
  }

  #dialogTransaction > div {
    width: 850px;
  }

  /*data-table*/

  .table-striped > tbody > tr:nth-child(even) {
    background-color: #eeeeee;
  }

  .table-striped > tbody > tr:nth-child(odd) {
    background-color: #fff;
  }

  /*分页*/

  .pagePath li a {
    border-radius: 0px !important;
    background-color: #eeeeee;
  }

  .pagePath .active a {
    background: #009cff !important;
    border-color: #009cff !important;
  }

  .fetchState1 p {
    margin-bottom: 5px;
    color: #868282;
  }
</style>
