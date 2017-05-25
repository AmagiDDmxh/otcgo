<template lang="pug" src="./status.pug"></template>
<style lang="stylus" src="./status.styl"></style>

<script>
  import { img } from '~utils/config'

  export default {
    data: () => ({
      img,
      data: {},
      shares: '',
      status: '',
      loading: false
    }),

    computed: {
      disabled() {
        return !this.shares ||
            this.status === 'success' ||
            this.status === 'failure'
      },

      p() {
        const currentShares = Number(this.data.currentShares)
        const totalShares = Number(this.data.totalSHares)
        return currentShares / totalShares || 0
      }
    },

    watchers: {
      status(val) {

      }
    },

    methods: {
      async bid() {
        if (!this.loggedIn) {
          this.$message.error('申购前请先确认登陆！')
          return
        }

        this.$store.commit('SET_RECEIVE')

        if (this.receive.valid < Number(this.data.valuePerShare)) {
          this.$message.warning(`${this.receive.name}余额不足，请进行充值！`)
          done()
          return
        }
        this.loading = true
        try {
          this.loading = true
          setTimeout(() => this.loading = false, 2000)
          const res = await this.$store.dispatch('BID_ICO', { id: 1, shares: this.shares })
          if (res.result) {
            this.$message.success('申购发起成功，请等待验收！')
            this.getICO(this.type)
            done()
            this.loading = false
          } else {
            this.$message.error('申购失败，请稍候再试。')
            done()
            this.getICO(this.type)
          }
        } catch(e) {
          this.$message.error('申购失败，请稍候再试。')
          this.getICO(this.type)
          this.loading = false
          done()
        }
      },

      async getICO() {
        this.data = await this.$store.dispatch('GET_ICO', 1)
      }
    },

    mounted() {
      this.getICO()
      this.status = this.data.status
    },
  }
</script>
