<template src="./balances.html"></template>
<style lang="stylus" src="./balances.styl"></style>

<script>
  import { getB } from '../../../api'
  import config from '../../../utils/config'

  export default {
    data() {
      return {
        balancesColumns: [
          {
            title: '资产类型',
            key: 'type'
          },
          {
            title: '总量',
            key: 'amount'
          },
          {
            title: '冻结量',
            key: 'frozen'
          },
          {
            title: '可用量',
            key: 'valid'
          }
        ],
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
        valid: Number,
        frozen: Number,
        rmb: Number,
        // 列表
        current_price: "",
        transfer_name: "",
        transfer_valid: "",

        // 交易
        buyNumValue: "",
        buyPriceValue: "",
        sellNumValue: "",
        sellPriceValue: "",
        transactionType: String,
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
    computed: {
      assets() {
        return this.$store.getters['assets']
      }
    },
    methods: {
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
        this.alipay_account = "";
      },
      balanceTransaction: function (asset, divisible, current_price, frozen, valid, name) {
        this.dialogTransaction = true
        this.assetId = asset;
        this.divisible = divisible;
        this.current_price = current_price;
        this.frozen = frozen;
        this.valid = valid;
        this.transactionType = name;
        if (name === '开拍学园币（KAC）') {
          this.valueassetid = this.assets.ansAsset['asset']
        }
      },
      ask: function (num, price) {
        var self = this;

        var postData = {
          assetid: self.assetId,
          price: price,
          amount: num,
          valueassetid: self.valueassetid,
          hex_pubkey: window.LJWallet.publicKey
        }
        // 交易步骤1:
        this.$http.post('ask/', postData, {
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

              if (config.debug) {
                console.log('交易步骤3->debug:', response);

                self.$message.success('[点击F12查看console拥有txid的保存数据] \r' +
                 '转账成功！txid:' + response.body.txid);
                console.log(response.body.txid);
              }
              self.$message.success('转账成功！');
              self.dialogTransaction = false;
            }, (response) => {
              if (config.debug) {
                console.log('交易步骤3->debug:', response);
                self.$message.error('交易失败！ :' + response.body.non_field_errors[0]);
              }
              self.$message.error('交易失败！');
              self.dialogTransaction = false;
            })
          }, (response) => {
            self.$message.error('交易失败！');
            // console.log('交易步骤2->debug:', response);
            self.dialogTransaction = false;
            throw response;
          });

        }, (response) => {
          self.$message.error('交易失败！');
          self.dialogTransaction = false;
          if (config.debug) console.log('交易步骤1->debug:', response);
        });

      },
      sell: function () {
        if (!this.sellNumValue || !this.sellPriceValue) {
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
        this.ask(this.sellNumValue, this.sellPriceValue);
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

            self.$http.get('nonce/').then((response) => {
              postData.nonce = response.data.nonce;

              self.$http.post('sign/', postData, {
                emulateHTTP: true,
                emulateJSON: true
              }).then((response) => {
                config.debug ? self.$message.success('转账成功！txid:' + response.body.txid) : self.$message.success('转账成功！');
                self.transfer_address_value = "";
                self.transfer_num = "";
                loading.close();
                self.dialogTransfer = false;

              }, (response) => {
                self.$message.error('转账失败,请重试!');
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
      },
      getBalances() {
        return this.$store.dispatch('GET_ASSET')
      }
    }
  };
</script>
