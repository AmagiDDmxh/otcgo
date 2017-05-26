<template lang="pug" src="./status.pug"></template>
<style lang="stylus" src="./status.styl"></style>

<script>
  import { img } from '~utils/config'
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      img,
      data: {},
      shares: '',
      status: '',
      adminAddress: '',
      loading: false,
      antchain: "https://antchain.xyz/tx/hash/"
    }),

    computed: {
      ...mapGetters(['loggedIn', 'receive', 'wa']),

      address() { return this.wa('address') },

      promiser() { return this.address === this.adminAddress },

      disabled() {
        return this.p === 100 ||
            !this.shares ||
            this.status === 'success' ||
            this.status === 'failure'
      },

      p() {
        const currentShares = Number(this.data.currentShares)
        const totalShares = Number(this.data.totalShares)
        return Number((currentShares / totalShares * 100).toFixed(2)) || 0
      },

      progressStatus() {
        if (this.status === 'success') return 'success'
        if (this.status === 'failure') return 'exception'
        return ''
      }

    },

    watch: {
      status(val) {
        if (val === 'success' || val === 'failure') {
          this.getICO()
          window.clearInterval(this.icoTimer)
        }
      }
    },

    methods: {
      async bid() {
        if (!this.loggedIn) return void this.$message.error('申购前请先确认登陆！')
        if (this.p === 100) return void this.$message.error('申购已结束！')

        this.$store.commit('SET_RECEIVE', '小蚁股')
        if (this.receive.valid < Number(this.data.valuePerShare))
          return this.$message.warning(`${this.receive.name}余额不足，请进行充值！`)

        try {
          this.loading = true
          setTimeout(() => this.loading = false, 2000)
          const res = await this.$store.dispatch('BID_ICO', {
            id: 5, shares: this.shares
          })
          if (res.result) {
            this.$message.success('申购发起成功，请等待验收！')
            setTimeout(
                () => {
                  this.getICO()
                  this.loading = false
                }
                , 2000)
          } else {
            this.$message.error('申购失败，请稍候再试。')
            setTimeout(
                () => {
                  this.getICO()
                  this.loading = false
                }
                , 2000)
          }
        } catch(e) {
          this.$message.error('申购失败，请稍候再试。')
          setTimeout(
              () => {
                this.getICO()
                this.loading = false
              }
              , 2000)
        }
      },

      async ask() {
        if (this.adminAddress !== this.address) return this.$message.error('你不是承兑有效者！')
        this.loading = true
        this.$store.dispatch('ASK_ICO', { id: 5, adminAdd: this.adminAddress})
            .then(() => {
              this.$message.success('承兑发起，请等待验收！')
              setTimeout(() => this.loading = false, 2000)
            })
            .catch(() => {
              this.$message.error('承兑失败，请稍后再试。')
              setTimeout(() => this.loading = false, 2000)
            })
      },

      async getICO() {
        this.data = await this.$store.dispatch('GET_ICO', 5)
      }
    },

    mounted() {
      this.getICO().then(() =>
          [
            this.status = '',
            this.adminAddress = ''
          ] = [
                this.data.status,
                this.data.adminAddress
              ]
      )
      this.icoTimer = setInterval(() => this.getICO(), 2000)
    },

    destroyed() {
      clearInterval(this.icoTimer)
    }
  }
</script>
