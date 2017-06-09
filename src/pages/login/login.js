import { img } from '~utils/config'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { decrypt, doValidatePwd } from '~utils/ljsign'


export default {
  data() {
    return {
      img,
      filename: '',
      password: '',
      filenameError: '',
      wallet: {},
      success: false,
      loading: false
    }
  },

  validations: {
    password: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(16)
    }
  },

  methods: {
    login() {
      this.loading = true
      try {
        const privateKey = decrypt(this.wallet['privateKeyEncrypted'], this.password)
        const result = doValidatePwd(privateKey, this.wallet['publicKey'])

        if (result) {
          this.wallet['privateKey'] = privateKey
          this.$store.dispatch('LOGIN', this.wallet)
              .then(() => {
                delete this.wallet
                this.loading = false
                this.$message.success('验证成功!')
                this.$router.push({ path: '/admin/balances' })
              }, () => {
                this.$message.error('验证失败，请检查钱包文件与密码重试!')
                this.loading = false
              })
        } else {
          this.loading = false
          this.$message.error('验证失败，请检查钱包文件与密码重试!')
        }
      } catch (e) {
        this.loading = false
        this.$message.error('验证失败，请检查钱包文件与密码重试!')
      }
    },
    readFile(file) {
      const reader = new window.FileReader()
      let vm = this

      reader.onload = function (e) {
        try {
          const data = JSON.parse(e.target.result)
          if (!vm.checkFile(data, file.name)) throw new Error('钱包文件错误！')
          vm.wallet = data
        } catch (err) {
          vm.filenameError = err.message
          vm.filename = ''
        }
      }
      reader.readAsText(file)
    },
    checkFile(file, filename) {
      if (!file.hasOwnProperty('publicKey') || !file.hasOwnProperty('publicKeyCompressed') ||
          !file.hasOwnProperty('privateKeyEncrypted') || !file.hasOwnProperty('address') ||
          !/.*\.json/.test(filename)) return false
      this.filename = filename
      this.filenameError = ''
      return true
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

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.loggedIn ? next('/admin') : next()
    })
  }
}
