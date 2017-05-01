export default {
  data() {
    return {
      filename: '',
      password: '',
      filenameError: '',
      wallet: {},
      errors: {
        pwd: ''
      },
      success: false
    }
  },
  methods: {
    login() {
      if (!this.checkPassword()) {
        return
      }

      try {
        var privateKey = decrypt(this.wallet['privateKeyEncrypted'], this.password)
        var result = doValidatePwd(privateKey, this.wallet['publicKey'])
      } catch (e) {
        this.$message.error('验证失败,请检查文件格式与密码重试!')
      }

      if (result) {
        this.wallet['privateKey'] = privateKey
        this.$message({
          message: '验证成功!',
          type: 'success'
        })
        setTimeout(() => {
          this.$router.push({
            path: '/admin'
          })
        }, 1000)
        this.$store.dispatch('LOGIN', this.wallet).then(() => delete this.wallet)
      } else {
        this.$message.error('验证失败,请检查文件格式与密码重试!')
      }
    },
    readFile(file) {
      const reader = new window.FileReader()
      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result)
          if (this.checkFile(data, file.name)) this.wallet = data
        } catch (err) {
          this.filenameError = '文件格式错误！'
          this.filename = ''
        }
      }
      reader.readAsText(file)
    },
    checkFile(file, filename) {
      if (!file.hasOwnProperty('publicKey') || !file.hasOwnProperty('publicKeyCompressed') ||
          !file.hasOwnProperty('privateKeyEncrypted') || !file.hasOwnProperty('address') || !/json/.test(filename)) return !1
      this.filename = filename
      this.filenameError = ''
      return true
    },
    checkPassword() {
      if (this.password === '') {
        this.errors.pwd = '密码不能为空'
        this.success = !1
        return false
      } else if (this.password.length < 8) {
        this.errors.pwd = '密码不能小于8位'
        this.success = !1
        return false
      } else if (this.password.length > 20) {
        this.errors.pwd = '密码不能超过20位'
        this.success = !1
        return false
      } else {
        this.errors.pwd = ''
        this.success = true
        return true
      }
    },
    selectAll(e) {
      setTimeout(() => e.target.select(), 0)
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters['loggedIn']
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push({ path: '/admin' })
    }
  }
}

// function:

// 登录钱包
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
