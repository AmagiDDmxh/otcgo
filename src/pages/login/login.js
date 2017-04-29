export default {
  data() {
    return {
      filename: '',
      password: '',
      filenameError: '',
      wallet: {},
      errors: {
        pwd: '',
      },
      success: false,
    };
  },
  methods: {
    login() {
      if (!this.checkPassword()) {
        return
      }

      try {
        var privateKey = decrypt(this.wallet['privateKeyEncrypted'], this.password);
        var result = doValidatePwd(privateKey, this.wallet['publicKey']);
      } catch (e) {
        this.$message.error('验证失败,请重试!');
        console.log(e)
      }

      if (result) {
        this.wallet['privateKey'] = privateKey;
        this.$message({
          message: '验证成功!',
          type: 'success',
        });
        setTimeout(() => {
          this.$router.push({
            path: '/admin',
          });
        }, 1000);
        this.$store.dispatch('LOGIN', this.wallet).then(() => delete this.wallet);
      } else {
        this.$message.error('!验证失败,请重试!');
        this.filename = '';
        this.password = '';
        this.filevalue = '';
      }
    },
    readFile(file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.wallet = JSON.parse(e.target.result);
      };
      reader.readAsText(file);
      return this.checkFilename(file.name);
    },
    checkFilename(filename) {
      if (!/json/.test(filename)){
        this.filenameError = '文件格式错误!';
        this.filename = ''
        return !1;
      }
      this.filename = filename
    },
    checkPassword() {
      if (this.password === '') {
        this.errors.pwd = '密码不能为空';
        return this.success = !1;
      } else if (this.password.length < 8) {
        this.errors.pwd = '密码不能小于8位';
        return this.success = !1;
      } else if (this.password.length > 20) {
        this.errors.pwd = '密码不能超过20位';
        return this.success = !1;
      } else {
        this.errors.pwd = '';
        return this.success = true;
      }
    },
  },
  computed: {
    loggedIn() {
      return this.$store.getters['loggedIn']
    }
  }
};

// function:

// 登录钱包
function decrypt(enckey, pwd) {
  //解密私钥
  var prvkey = CryptoJS.AES.decrypt(enckey, pwd).toString(CryptoJS.enc.Utf8);
  return prvkey;
}

function doSign(prvkey, msg) {
  //签名
  var sig = new KJUR.crypto.Signature({
    'alg': 'SHA256withECDSA',
  });
  sig.initSign({
    'ecprvhex': prvkey,
    'eccurvename': 'secp256r1',
  });
  sig.updateString(msg);
  var sigval = sig.sign();
  return sigval;
}

function doVerify(pubkey, msg, sigval) {
  //验证签名
  var sig = new KJUR.crypto.Signature({
    'alg': 'SHA256withECDSA',
    'prov': 'cryptojs/jsrsa',
  });
  sig.initVerifyByPublicKey({
    'ecpubhex': pubkey,
    'eccurvename': 'secp256r1',
  });
  sig.updateString(msg);
  var result = sig.verify(sigval);
  return result;
}

function doValidatePwd(prvkey, pubkey) {
  //验证密码
  //返回true,说明用户输入的密码正确
  //返回false,说哦名密码有误
  if (0 == prvkey.length) return false;
  var msg = 'aaa';
  var sigval = doSign(prvkey, msg);
  var result = doVerify(pubkey, msg, sigval);
  return result;
}
