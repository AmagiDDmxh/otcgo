<template src="./balances.html"></template>
<style lang="stylus" src="./balances.styl"></style>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import transferModal from '~components/admin/transferModal.vue'
  import askModal from '~components/admin/askModal'

  export default {
    components: { transferModal, askModal },
    data() {
      return {
        // dialog
        dialogPay: false,
        dialogDisPay: false,
        transferModal: false,
        askModal: false
      }
    },
    computed: {
      ...mapGetters(['balances', 'wa'])
    },
    methods: {
      transfer({ name }) {
        this.$store.commit('SET_DELIVER', name)
        this.transferModal = true
      },
      transferSuccess() {
        this.transferModal = false
      },
      ask({ name }) {
        this.$store.commit('SET_DELIVER', name)
        this.$store.commit('SET_RECEIVE', '小蚁股')
        this.askModal = true
      },
      askSuccess() {
        this.askModal = false
      },
      ...mapActions({
        getAsset: 'GET_ASSET',
        getUID: 'GET_UID'
      })
    },
    created() {
      this.getAsset()
      window.balancesTimer = window.setInterval(() => this.getAsset(), 1000 * 2)
      this.getUID(this.wa('address'))
    },
    destroyed() {
      window.clearInterval(window.balancesTimer)
    }
  }
</script>
