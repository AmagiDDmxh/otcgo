<template lang="pug" src="./status.pug"></template>
<style lang="stylus" src="./status.styl"></style>

<script>
  import { img } from '~utils/config'
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      img,
      id: 1,
      data: {},
      shares: null,
      status: null,
      adminAddress: null,
      loading: false,
      antchain: "https://antchain.xyz/address/",
      password: null,
      countdownText: null
    }),

    computed: {
      ...mapGetters(['loggedIn', 'receive', 'wa']),

      address() { return this.wa('address') },

      promiser() { return this.address === this.adminAddress },

      disabled() {
        return this.p === 100 ||
            !this.shares ||
            this.status === 'success' ||
            this.status === 'failure' ||
            !this.password
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
      },

      time() {
        return new Date()
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
      formattingTime(time) {
        let days = ''
        let hours = ''
        let seconds = ''
        let minutes = ''

        if (time.hours) hours = time.hours() + '小时'
        if (time.seconds) seconds = time.seconds() + '秒'
        if (time.minutes) minutes = time.minutes() + '分'
        if (time.days) days = time.days() + '天'

        return days + hours + minutes + seconds
      },

      countdown(time) {
        const interval = 1000

        if (time !== 0) {
          let formatTime = this.$mo.duration(time*1000)

          this.countdownText = this.formattingTime(formatTime)

          this.countdownTimer = setInterval(() => {
            this.countdownText = this.formattingTime(formatTime.subtract(interval))
          }, interval)
        }
      },

      async bid({ id, shares, password }) {
        if (!id || !shares || !password) return this.$message.error('请输入有效字符！')
        if (!this.loggedIn) return void this.$message.error('申购前请先确认登陆！')
        if (this.p === 100) return void this.$message.error('申购已结束！')
        if (!Number.isInteger(this.shares)) return void this.$message.error('请输入整数！')


        try {
          this.$msgbox({
            title: '提示',
            message: `是否确认申购${this.shares}份？`,
            showCancelButton: true,
            beforeClose: async (action, instance, done) => {
              instance.confirmButtonLoading = false

              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '执行中...'
                try {
                  const res = await this.$store.dispatch('BID_ICO', { id, shares, password })
                  if (res.result) {
                    this.$message.success('申购发起成功，请等待验收！')
                    this.getICO()
                    instance.confirmButtonLoading = this.loading = false
                    done()
                  } else {
                    this.$message.error('申购失败，请稍候再试。')
                    this.getICO()
                    instance.confirmButtonLoading = this.loading = false;
                    done()
                  }
                } catch(e) {
                  this.$message.error(e.data.error)
                  this.getICO()
                  this.loading = false
                  instance.confirmButtonLoading = false
                  done()
                }
              } else {
                done()
              }
            }
          })
        } catch(e) {
          this.$message.error(e)
          setTimeout(() => { this.getICO(); this.loading = false }, 2000)
        }
      },

      async ask({ id, adminAddress }) {
        if (this.adminAddress !== this.address) return this.$message.error('你不是承兑有效者！')

        this.loading = true
        this.$store.dispatch('ASK_ICO', { id, adminAddress })
            .then(r => r.json())
            .then(() => {
              this.$message.success('承兑发起，请等待验收！')
              setTimeout(() => this.loading = false, 2000)
            }, e => {
              this.$message.error(e.body.error)
              setTimeout(() => this.loading = false, 2000)
            })
            .catch(e => {
              console.log(e)
              setTimeout(() => this.loading = false, 2000)
            })
      },

      async getICO() {
        this.data = await this.$store.dispatch('GET_ICO', this.id)
        this.status = this.data.status
        this.adminAddress = this.data.adminAddress
        return {
          ...this.data
        }
      }
    },

    created() {
      const id = this.id

      this.getICO().then(r => {
        this.status = r.status
        this.adminAddress = r.adminAddress
        this.countdown(r.countdown)
      })

      this.icoTimer = setInterval(() => this.getICO(), 2000)
    },

    destroyed() {
      clearInterval(this.icoTimer)
      clearInterval(this.countdownTimer)
    }
  }
</script>
