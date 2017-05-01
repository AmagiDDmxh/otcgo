<template>
  <div class="container container-padding">
    <div class="panel panel-default panel-state">
      <div class="panel-body">
        创建离线钱包
      </div>
    </div>
    <div class="login-body row">
      <!-- Left side Warning: -->
      <div class="col-xs-3 col-lg-3">
        <div class="ad-tips">
          <ol>
            <li>
              请输入不超过20个字符的账户名。（可包含中文、英文、下划线，但不能以下划线开头）
            </li>
            <li>
              请输入8～16位便于牢记的登陆密码。（字母、数字、特殊字符的组合）
            </li>
            <li>
              请重复输入登录密码。
            </li>
          </ol>
        </div>
      </div>
      <!-- Warning End -->

      <!-- SignUp account Interface: -->
      <div class="content col-xs-9 col-lg-9">
        <h3 class="h2">创建离线钱包</h3>
        <div class="creatWallet-body" style="width:100%">
          <div class="row" style="margin-top:35px">
            <!-- Account -->
            <div class="col-xs-3 ">
              <p class="text-right" style="line-height: 30px;"> 账户名: </p>
            </div>

            <div class="col-xs-4">
              <input v-model="username" class="form-control" name="username"/>
            </div>

            <div class="col-xs-3" style="padding-left:0px;">
							<span
                  class="error-text"
                  style="display:inline-block;margin-top:5px;"
                  v-if="username.length >=20"
              > 用户名不能超过20位 </span>

              <span
                  v-else-if="username==''"
                  class="error-text"
                  style="display:inline-block;margin-top:5px;"
              > 用户名不能为空</span>

              <span v-else>
								<img src="/src/assets/yes.png"/>
							</span>
            </div>
          </div>

          <!-- WIF: Hex Key -->
          <div class="row" style="margin-top:10px">
            <div class="col-xs-3 ">
              <p class="text-right" style="line-height: 30px;"> WIF私钥: </p>
            </div>
            <div class="col-xs-4">
              <input v-model="wif" class="form-control" name="username" placeholder="若您没有WIF私钥，此栏不用填"/>
            </div>

            <div class="col-xs-3" style="padding-left:0px;">
							<span
                  class="error-text"
                  style="display:inline-block;margin-top:5px;"
                  v-show="wifError"> 私钥验证错误请重试 </span>
            </div>
          </div>

          <div class="row" style="margin-top:10px">
            <div class="col-xs-3 ">
              <p class="text-right" style="line-height: 30px;">登录密码: </p>
            </div>
            <div class="col-xs-4">
              <input
                  type="password"
                  class="form-control"
                  v-model="password"/>
            </div>
            <div class="col-xs-3" style="padding-left:0;">
							<span
                  class="error-text"
                  style="display:inline-block;margin-top:5px;"
                  v-if="password.length < 8 && password.length >0"> 密码不能小于8位 </span>
              <span
                  v-else-if="password === ''"
                  class="error-text"
                  style="display:inline-block;margin-top:5px;"> 密码不能为空 </span>
              <span v-else> <img src="/src/assets/yes.png"/> </span>
            </div>
          </div>
          <div class="row" style="margin-top:10px">
            <div class="col-xs-3">
              <p class="text-right" style="line-height: 30px;"> 重复密码: </p>
            </div>
            <div class="col-xs-4">
              <input
                  type="password" class="form-control"
                  v-model="passwordConfirmed"/>
              <p v-show="passwordError" class="error-text"> {{ passwordError }} </p>
            </div>
            <div class="col-xs-3" style="padding-left:0;">
							<span
                  v-if="passwordConfirmed.length < 8 && password.length > 0"
                  class="error-text" style="display:inline-block;margin-top:5px;"> 密码不能小于8位 </span>
              <span
                  v-else-if="passwordConfirmed != password"
                  class="error-text"
                  style="display:inline-block;margin-top:5px;"> 两次密码输入不一致 </span>
              <span
                  v-else-if="passwordConfirmed==''"
                  class="error-text"
                  style="display:inline-block;margin-top:5px;"> 密码不能为空 </span>
              <span v-else> <img src="/src/assets/yes.png"/> </span>
            </div>
          </div>
          <div class="row" style="margin-top:10px">
            <div class="col-xs-3 ">
            </div>
            <div class="col-xs-6">
              <el-button type="button" :loading="loading"
                         class="btn  btn-lj form-control"
                         style="border-radius: 6px;"
                         @click="createWallet">下一步</el-button>
            </div>
          </div>
        </div>
        <p class="tips">
          离线钱包由小蚁区块链提供技术支持
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data: () => ({
      username: '',  // 用户名
      password: '',  // 密码框 1
      passwordConfirmed: '',  // 密码框 2
      passwordError: '',
      wif: '', // 私钥
      wifError: false,
      loading: false
    }),
    methods: {
      createWallet() {
        if (this.password === '' || this.passwordConfirmed === '') return
        if (this.password.length < 8 || this.passwordConfirmed.length < 8) return

        // 生成公私钥对
        if (this.wif) {
          if (!/[a-z0-9A-Z]{52}/.test(this.wif)) {
            this.wifError = !this.wifError
            return
          }
          var publicKey = ljWifkeyToPubkey(this.wif)
          var privateKey = ljWifkeyToHexkey(this.wif)
        } else {
          var keyp = genKeyPairHex()
          var publicKey = keyp['pubhex']
          var privateKey = keyp['prvhex']
        }
        var privateKeyEncrypted = encryptPrivateKey(privateKey, this.passwordConfirmed)
        var publicKeyCompressed = getCompressedPubHex(publicKey)

        this.loading = true
        this.$store.commit('SET_FILE_NAME', this.username + '.json')
        this.$store.dispatch('SIGN_UP', {
          publicKeyCompressed,
          publicKey,
          privateKeyEncrypted,
          privateKey
        }).then(() => {
          this.loading = false
          this.$router.push({
            path: '/signUpNext'
          })
        }, () => {
          this.loading = false
          this.$message.error('创建钱包失败，请重试')
        })
      }
    }
  }

  function genKeyPairHex() {
    const keypair = new KJUR.crypto.ECDSA({
      'curve': 'secp256r1'
    }).generateKeyPairHex()
    return {
      'pubhex': keypair.ecpubhex,
      'prvhex': keypair.ecprvhex
    }
  }

  function encryptPrivateKey(prvkey, pwd) {
    return CryptoJS.AES.encrypt(prvkey, pwd).toString()
  }

  function getCompressedPubHex(pubhex) {
    const ec = new KJUR.crypto.ECDSA({
      'curve': 'secp256r1',
      'pub': pubhex
    })
    const result = ec.getPublicKeyXYHex()
    const y = result['y']
    const prefix = parseInt('0x' + y[y.length - 1]) % 2 ? '03' : '02'
    return prefix + result['x']
  }

  function decrypt(enckey, pwd) {
    // 解密私钥
    var prvkey = CryptoJS.AES.decrypt(enckey, pwd).toString(CryptoJS.enc.Utf8)
    return prvkey
  }

  function doSign(prvkey, msg) {
    // 签名
    var sig = new KJUR.crypto.Signature({
      'alg': 'SHA256withECDSA'
    })
    sig.initSign({
      'ecprvhex': prvkey,
      'eccurvename': 'secp256r1'
    })
    sig.updateString(msg)
    var sigval = sig.sign()
    return sigval
  }

  function doVerify(pubkey, msg, sigval) {
    // 验证签名
    var sig = new KJUR.crypto.Signature({
      'alg': 'SHA256withECDSA',
      'prov': 'cryptojs/jsrsa'
    })
    sig.initVerifyByPublicKey({
      'ecpubhex': pubkey,
      'eccurvename': 'secp256r1'
    })
    sig.updateString(msg)
    var result = sig.verify(sigval)
    return result
  }

  function doValidatePwd(prvkey, pubkey) {
    // 验证密码
    // 返回true,说明用户输入的密码正确
    // 返回false,说哦名密码有误
    if (prvkey.length == 0) return false
    var msg = 'aaa'
    var sigval = doSign(prvkey, msg)
    var result = doVerify(pubkey, msg, sigval)
    return result
  }
</script>


<style lang="css" scoped>
  .btn-lj {
    background-color: #009cff;
    color: #fff;
    border-radius: 6px;
  }

  .btn-lj:hover {
    background-color: #0585d6 !important;
    color: #fff;
  }

  .error-text {
    display: inline-block;
    margin-top: 5px;
  }

  .username {
    line-height: 30px;
  }
</style>
