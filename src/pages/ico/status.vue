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
        const totalShares = Number(this.data.totalShares)
        return (currentShares / totalShares * 100).toFixed(2) || 0
      },

      ...mapGetters(['loggedIn', 'receive'])
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

        this.$store.commit('SET_RECEIVE', '小蚁股')

        if (this.receive.valid
            < Number(this.data.valuePerShare)) return this.$message.warning(`${this.receive.name}余额不足，请进行充值！`)

        this.loading = true
        try {
          this.loading = true
          setTimeout(() => this.loading = false, 2000)
          const res = await this.$store.dispatch('BID_ICO', { id: 1, shares: this.shares })
          if (res.result) {
            this.$message.success('申购发起成功，请等待验收！')
            this.getICO(this.type)
            this.loading = false
          } else {
            this.$message.error('申购失败，请稍候再试。')
            this.getICO(this.type)
          }
        } catch(e) {
          this.$message.error('申购失败，请稍候再试。')
          this.getICO(this.type)
          this.loading = false
        }
      },

      async getICO() {
        this.data = await this.$store.dispatch('GET_ICO', 1)
      }
    },

    mounted() {
      this.getICO().then(() => this.status = this.data.status)
      this.icoTimer = setInterval(() => this.getICO(), 2000)
    },

    destroyed() {
      clearInterval(this.icoTimer)
    }
  }
</script>
