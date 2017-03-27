<template src="./login.html"></template>
<style src="./login.css" lang="css"></style>

<script>
  import { decrypt, doValidatePwd } from '../../utils/ljsign'

  export default {
    name: 'login',
    data() {
      return {
        filename: "",
        password: "",
        filenameError: "",
        filevalue: "",
        disabled: ''
      }
    },
    methods: {
      login(e) {
        if (!this.filename) {
          this.filenameError = "文件不能为空";
          return;
        }
        if (this.password.length < 8) {
          this.$message.error("密码不能小于8位");
          return;
        }
        this.$store.dispatch('login', this.password).then(e => {
          this.$message.success('验证成功！')
          setTimeout(() => this.$router.push({ path: 'admin' }), 500)
        }).catch(e => {
          this.$message.error('密码错误， 请重新尝试！')
          this.password = '';
        })
      },

      fileChangeFunc(e) {
        let file = e.target.files;

        if (file[0] && /json/.test(file[0].name)) {
          this.filenameError = ''
          this.filename = file[0].name
          let reader = new FileReader()
          reader.readAsText(file[0])
          reader.onload = e => {
            console.log("[e] evnent", e.target)
            window.e = e

            var fileString = e.target.result
            const obj = JSON.parse(fileString)
            this.$store.dispatch({
              type: "setField",
              field: {
                "add r": obj['address'],
                "pk c": obj['publicKeyCompressed'],
                "pb k": obj['publicKey'],
                "pk r": obj['privateKeyEncrypted']
              }
            })
            this.$store.dispatch('getUid')
          }
        } else {
          this.filenameError = '文件格式错误！'
        }
      }
    },

    mounted() {
      if (this.$store.getters.HAS) {
        this.$router.push({
          path: '/admin'
        });
      }
    }
  }
</script>