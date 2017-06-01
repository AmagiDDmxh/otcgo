<template src="./signUp.html"></template>
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

<script>
  import protocol from '../protocol/index.vue'
  import { required, maxLength, minLength, sameAs } from 'vuelidate/lib/validators'
  import { genKeyPairHex, encryptPrivateKey, getCompressedPubHex } from '~utils/ljsign'
  import { ljWifkeyToPubkey, ljWifkeyToHexkey } from '~libs/LJSign'

  export default {
    components: { protocol },

    name: 'signUp',

    data: () => ({
      agree: false,
      protocolModal: false,
      username: '',  // 用户名
      password: '',  // 密码框 1
      passwordConfirmed: '',  // 密码框 2
      passwordError: '',
      wif: '', // 私钥
      wifError: false,
      loading: false
    }),

    computed: {
      disabled() {
        if (this.$v.$invalid) return true
        return !this.agree
      }
    },

    validations: {
      username: {
        required,
        maxLength: maxLength(20)
      },
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(16)
      },
      passwordConfirmed: {
        required,
        sameAsPassword: sameAs('password')
      }
    },

    methods: {
      createWallet() {
        if (!this.password || !this.passwordConfirmed ||
            this.password.length < 8 || this.passwordConfirmed.length < 8 ||
            this.password.length > 16 || this.passwordConfirmed.length > 16) return

        // 生成公私钥对
        if (this.wif) {
          if (!/[a-z0-9A-Z]{52}/.test(this.wif)) { this.wifError = !this.wifError; return }

          var publicKey = ljWifkeyToPubkey(this.wif)
          var privateKey = ljWifkeyToHexkey(this.wif)
        } else {
          var keyPair = genKeyPairHex()
          var publicKey = keyPair['pubhex']
          var privateKey = keyPair['prvhex']
        }
        const privateKeyEncrypted = encryptPrivateKey(privateKey, this.passwordConfirmed)
        const publicKeyCompressed = getCompressedPubHex(publicKey)

        this.loading = true
        this.$store.commit('SET_FILE_NAME', `${this.username}.json`)
        this.$store.dispatch('SIGN_UP', { publicKeyCompressed, publicKey, privateKeyEncrypted, privateKey })
            .then(() => { this.loading = false; this.$router.push('/signUpNext'); },
                  () => { this.loading = false; this.$message.error('创建钱包失败，请重试') })
      }
    }
  }
</script>
