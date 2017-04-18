<template>
  <div class="container container-padding">
    <div class="panel panel-default panel-state">

      <div class="panel-body"> 登录离线钱包 </div>

    </div>
    <div class="row">
      <div class="col-xs-9 col-xs-offset-3">
        <h3 class="h2">登录离线钱包</h3>
      </div>
    </div>
    <div class="login-body row">
      <div class="col-xs-3 col-lg-3">
        <div class="ad-tips">
          <ol>
            <li>点击"浏览"按钮，找到钱包备份文件所在的硬盘位置，并导入。</li>
            <li>输入您在创建钱包时,设置的钱包密码。</li>
            <li>当前钱包页面为WED离线钱包页面，请放心导入钱包备份文件。</li>
          </ol>
        </div>
      </div>
      <div class="content col-xs-9 col-lg-9">
        <div>
          <form class="from-group login">
            <div class="input-group">
              <input type="text" class="form-control" id="select-file" style="background-color: #fff;" readonly
                     :value="filename" placeholder="导入钱包文件">
              <label class="btn-bs-file btn  btn-select-file btn-primary btn-lj">
                浏览
                <input type="file" id="file" :value="filevalue"/>
              </label>
              <span v-show="filenameError" style="display:inline-block;padding-left:10px;" class="error-text">
                                {{filenameError}}
                            </span>
            </div>
            <div class="input-group">
              <input type="password" class="form-control pwd" v-model="password" placeholder="输入钱包密码">
              <span v-if="password==''" style="display:inline-block;padding-left:10px;margin-top:5px;"
                    class="error-text">

                              密码不能为空
                            </span>
              <span v-else-if="password.length< 8" style="display:inline-block;padding-left:10px;margin-top:5px;"
                    class="error-text">
                                 密码不能小于8位
                             </span>
              <span v-else style="display:inline-block;padding-left:10px;"> <img src="/src/assets/yes.png"/> </span>
            </div>
            <div class="input-group">
              <button type="button" style="border-radius:6px;" @click="login"
                      class="form-control text-center select-file btn-lj">
                登 &nbsp &nbsp 录

              </button>
            </div>
            <div class="register text-center">
              <router-link to="/creatWallet">没有钱包?立即创建!</router-link>
            </div>
          </form>
        </div>

        <p class="tips">离线钱包由小蚁区块链提供技术支持</p>
      </div>
    </div>
  </div>
</template>
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
        if (this.filename === "") {
          this.filenameError = "文件不能为空";
          return;
        }
        if (this.password.length < 8) {
          return;
        }
        // 解密钱包和密码

        var privateKey = decrypt(window.LJWallet['privateKeyEncrypted'], this.password);
        var result = doValidatePwd(privateKey, window.LJWallet['publicKey']);
        if (result) {
          window.LJWallet['privateKey'] = privateKey;
          //登录时效
          setTimeout(function () {
            window.LJWallet = null;
          }, 1000 * 60 * 60);

          // console.log("验证成功!")
          this.$message({
            message: '验证成功!',
            type: 'success'
          });
          setTimeout(function () {
            self.$router.push({
              path: '/admin'
            });
          }, 1000);

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
            // 验证成功
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
<style lang="css">
  .fileDiv {
    position: absolute;
    top: 0;
    right: 81px;
    left: 0;
    height: 34px;
    border: 1px solid #ccc;
    border-radius: 6px;
    line-height: 34px;
    padding-left: 12px;
    color: #999;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    border-botton-right-radius: 0;
    border-top-right-radius: 0
  }

  .register a {
    color: #aeaeae;
  }

  .register a:hover {
    color: #337ab7;
  }

  .h2 {
    border-bottom: 1px solid #000;
    padding-bottom: 10px;
  }

  .login {
    margin: 0 auto;
    margin-top: 40px;
    width: 52%;
  }

  .input-group {
    margin-top: 20px;
  }

  .form-control {
    border-radius: 6px;
  }

  .select-file {
    background-color: #009cff !important;
    color: #fff !important;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }

  .pwd {
    border-radius: 6px !important;
  }

  .tips {
    border-top: 1px solid #b1b1b1;
    width: 100%;
    color: #b1b1b1;
    bottom: 40px;
    margin-top: 140px;
  }

  .content {
    height: 100%;
    position: relative;
  }

  .register {
    color: #b1b1b1;
    padding-right: 162px;
    padding-top: 15px;
  }

  /*ht*/

  .crow {
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
  }

  .crow .msg {
    width: 100%;
    border-radius: 0;
  }

  .login-body #select-file {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  /*btn-file*/

  .btn-bs-file {
    position: relative;
    background: #009cff;
    border-color: #009cff;
  }

  .btn-bs-file:hover {
    background: #009cff;
    border-color: #009cff;
  }

  .btn-bs-file input[type="file"] {
    position: absolute;
    top: -9999999;
    filter: alpha(opacity=0);
    opacity: 0;
    width: 0;
    height: 0;
    outline: none;
    cursor: inherit;
  }

  .btn-select-file {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  .link-span {
    color: #009cff;
  }

  .link-span:hover {
    cursor: pointer;
  }

  .ad-tips ol {
    background-color: #ccc;
    padding-top: 30px;
    padding-bottom: 30px;
    padding-left: 32px;
    padding-right: 20px;
    color: #aeaeae;
    background: #f2f2f2;
    /*  margin-top: 64px;*/
  }

  .ad-tips li {
    margin-bottom: 12px;
  }
</style>
