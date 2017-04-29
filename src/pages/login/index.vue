<template lang="pug" src="./login.pug"></template>
<style lang="stylus" src="./login.styl"></style>

<script>
  export default {
    data() {
      return {
        filename: "",
        password: "",
        filenameError: "",
        filevalue: ""
      }
    },
    methods: {
      login: function () {
        let self = this;
        if (!this.filename) {
          this.filenameError = "文件不能为空";
          return;
        }
        if (this.password.length < 8) {
          return;
        }

        var privateKey = decrypt(window.LJWallet['privateKeyEncrypted'], this.password);
        var result = doValidatePwd(privateKey, window.LJWallet['publicKey']);

        if (result) {
          window.LJWallet['privateKey'] = privateKey;

          this.$message({
            message: '验证成功!',
            type: 'success'
          });
          setTimeout(function () {
            self.$router.push({
              path: '/admin'
            });
          }, 1000);
          this.$store.dispatch('GET_UID', window.LJWallet['address'])
        } else {
          this.$message.error('验证失败,请重试!');
          this.filename = "";
          this.password = "";
          this.filevalue = "";
        }
      }
    },

    mounted: function () {
      var self = this;
      if (window.LJWallet) {
        self.$router.push({
          path: '/admin'
        });
        return;
      }
      // 读取json文件内容
      $("#file").change(function (e) {

        var file = e.target.files;
        // console.log(file);
        if (file[0]) {
          self.filename = file[0].name;
          var reader = new FileReader();
          reader.readAsText(file[0]);
          reader.onload = loaded;
          self.filenameError = false;
        }

        function loaded (e) {
          var fileString = e.target.result;

          try {
            var LJWallet = JSON.parse(fileString);
            // console.log(LJWallet);
            // 缺少 address、publicKeyCompressed、publicKey、privateKeyEncrypted任一项
            if (LJWallet.address == undefined || LJWallet.publicKeyCompressed == undefined ||
              LJWallet.publicKey == undefined || LJWallet.privateKeyEncrypted == undefined) {
              this.filenameError = "钱包文件格式有误,请重新选择";
              this.filename = "";
              this.filevalue = "";
              return;
            }
            $('#header-a').text('我的钱包')
            window.LJWallet = LJWallet;
          } catch (e) {
            // json 文件解析错误
            self.filenameError = "钱包文件格式有误,请重新选择";
            self.filename = "";
            self.filevalue = "";
          }
        }
      })
    }
  }

  // function:

  // 登录钱包
  function decrypt (enckey, pwd) {
    //解密私钥
    var prvkey = CryptoJS.AES.decrypt(enckey, pwd).toString(CryptoJS.enc.Utf8);
    return prvkey;
  }

  function doSign (prvkey, msg) {
    //签名
    var sig = new KJUR.crypto.Signature({
      'alg': 'SHA256withECDSA'
    });
    sig.initSign({
      'ecprvhex': prvkey,
      'eccurvename': 'secp256r1'
    });
    sig.updateString(msg);
    var sigval = sig.sign();
    return sigval;
  }

  function doVerify (pubkey, msg, sigval) {
    //验证签名
    var sig = new KJUR.crypto.Signature({
      "alg": 'SHA256withECDSA',
      "prov": "cryptojs/jsrsa"
    });
    sig.initVerifyByPublicKey({
      'ecpubhex': pubkey,
      'eccurvename': 'secp256r1'
    });
    sig.updateString(msg);
    var result = sig.verify(sigval);
    return result;
  }

  function doValidatePwd (prvkey, pubkey) {
    //验证密码
    //返回true,说明用户输入的密码正确
    //返回false,说哦名密码有误
    if (0 == prvkey.length) return false;
    var msg = 'aaa';
    var sigval = doSign(prvkey, msg);
    var result = doVerify(pubkey, msg, sigval);
    return result;
  }
</script>
