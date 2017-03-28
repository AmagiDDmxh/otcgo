<template src="./balances.html"></template>
<style src="./balances.css" lang="css"></style>
<script>
  import mapGetters from 'vuex';

  export default {
    data() {
      return {
        // dialog
        dialogTransfer: false,
        balances: [],

        // common
        valueassetid: "",
        assetId: "",
        divisible: false,

        // 列表
        current_price: "",
        transfer_name: "",
        transfer_valid: "",

        // 转账
        transfer_num: "",
        transfer_address_value: "",
        transfer_err: false,

        // 按钮 Button
        loading: false,
        errNum: 1
      }
    },

    computed: {
      checkOutKeyValue() {
        return Number(this.transfer_num) > Number(this.transfer_valid) ||
            (this.divisible ?
                    !/^\d+(\.\d{1,8})?$/.test(this.transfer_num) :
                    !/^\d+$/.test(this.transfer_num)
            )
      }
    },

    methods: {
      getBalances: function() {
        this.$store.dispatch('getBalances').then(({ data }) => {
          [ this.balances = [], this.valueasstid = NaN ] = [ data.balances, data.balances[0].asset];
        }, res => {
          if (this.errNum <= 2) {
            this.$message.error('服务器有点过载, 请稍等一下!');
            this.errNum++;
          } else {
            this.errNum = 1;
          }
        });
      },

      balanceTransfer(asset, divisible, name, valid) {
        this.transfer_num = '';
        this.transfer_address_value = '';
        this.assetId = asset;
        this.transfer_name = name;
        this.transfer_valid = valid;
        this.divisible = divisible;
        this.dialogTransfer = true;
        this.loading = false;
      },

      transfer() {
        let address_value = this.transfer_address_value.trim();
        if (this.transfer_num === "" ||
            this.transfer_address_value === "" ||
            this.checkOutKeyValue ||
            (!this.divisible) && (Number(this.transfer_num) % 1 !== 0)) {
          return;
        }

        if (!(/[a-zA-Z0-9]{34}/.test(address_value))) {
          this.$message.error("地址有误，请查看重试！");
          return;
        }

        if (this.divisible) {
          this.transfer_num = Number(this.transfer_num).toFixed(8);
          if (!this.transfer_num) {
            return;
          }
        } else {
          this.transfer_num = Math.floor(this.transfer_num);
          if (!this.transfer_num) {
            return;
          }
        }
        this.loading = true;
        this.$store.dispatch('transfer', {
          assetId: this.assetId,
          transfer_num: this.transfer_num,
          transfer_address_value: this.transfer_address_value
        }).then(r => {
          this.$message.success('转账已发起，请等待确认！')
          this.dialogTransfer = !this.dialogTransfer
          this.loading = !this.loading
        }, e => {
          alert("[ERROR]")
          console.log("[ERROR] [-] ", e)
          this.$message.error('转账失败，请稍候片刻再试！')
          this.dialogTransfer = false
        })
      }
    },

    mounted(){
      this.getBalances();
      refreshBalance = setInterval(() => {
        this.getBalances()
      }, 1000 * 5);
    },

    destroyed(){
      clearInterval(refreshBalance);
    }
  }
  let refreshBalance;
</script>
