<template src="./signup.html"></template>
<script>
  import { genKeyPairHex, encryptPrivateKey, getCompressedPubHex, download } from '../../utils/download';
  export default {
    data() {
      return {
        username: "",
        password: "",
        password_confirmation: "",
        filename: "",
        passwordError: "",
        wif: "",
        falseWIFMessage: false,
        accountRegExp: new RegExp(/^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/),
        passwordRegExp: new RegExp(/^[\w\W]{8,16}$/),
        specialCharacter: new RegExp(/[`~!@#$^&*()=\|{}':;,\[\].<>/?！￥…（）—【】‘；：”“。，、？+"·《》%-]/)
      }
    },
    methods: {
      creatWallet: function () {
        if (!this.passwordRegExp.test(this.password) ||
            !this.passwordRegExp.test(this.password_confirmation) ||
            !this.accountRegExp.test(this.username) ||
            this.password !== this.password_confirmation) {
          return;
        }
        // 生成公私钥对
        if (this.wif) {
          if (/^[a-z0-9A-Z]{52}$/.test(this.wif)) {
            var publicKey = ljWifkeyToPubkey(this.wif);
            var privateKey = ljWifkeyToHexkey(this.wif);
          } else {
            this.falseWIFMessage = !this.falseWIFMessage;
            this.$message.error('请仔细检查私钥！')
            return;
          }
        } else {
          let keyp = genKeyPairHex();
          var publicKey = keyp['pubhex'];
          var privateKey = keyp['prvhex'];
        }
        let privateKeyEncrypted = encryptPrivateKey(privateKey, this.password_confirmation);
        let publicKeyCompressed = getCompressedPubHex(publicKey);

        this.$http.get('conversion/' + publicKeyCompressed).then((response) => {
          // 生成钱包文件
          let json = {
            address: response.data.address,
            publicKeyCompressed: publicKeyCompressed,
            publicKey: publicKey,
            privateKeyEncrypted: privateKeyEncrypted
          }
          let filename = this.username + '.json'

          window.file = json;
          download(JSON.stringify(json), filename, 'text/plain');
          this.$router.push({
            path: 'wa',
            query: {
              filename: filename
            }
          })
        }, e => {
          this.$message.error('创建钱包失败，请重试');
        })
      }
    },
    mounted() {
      this.$store.commit("RESET");
    }
  }
</script>

<style lang="stylus">
  .btn-lj
    background-color #2c9
    &:hover
      background-color #297
      color white
</style>
