export default {
  data() {
    return {
      firstButton: ['oContent__tab', 'btn', { 'oContent__tab--active': true }],
      secondButton: ['oContent__on-tab', 'btn', { 'oContent__on-tab--active': false }],
      contentOne: true,
      contentTwo: false,
      anccny: 0,
      anscny: 0,
      kacans: 0
    }
  },
  methods: {
    switchOne(e) {
      e.target.classList.add('oContent__tab--active')
      if (e.target.previousSibling) {
        e.target.previousSibling.classList.remove('oContent__tab--active')
      }
      if (e.target.nextSibling) {
        e.target.nextSibling.classList.remove('oContent__on-tab--active')
      }
      this.contentOne = true
      this.contentTwo = false
    },
    switchTwo(e) {
      e.target.classList.add('oContent__on-tab--active')
      if (e.target.previousSibling) {
        e.target.previousSibling.classList.remove('oContent__tab--active')
      }
      if (e.target.nextSibling) {
        e.target.nextSibling.classList.remove('oContent__on-tab--active')
      }
      this.contentOne = false
      this.contentTwo = true
    },

    async getPrice() {
      this.kacans = (await this.$http.get(`price/kacans`)).body
      this.anccny = ((await this.$http.get(`price/anccny`)).body) || 0
      this.anscny = ((await this.$http.get(`price/anscny`)).body) || 0
    },
    toMarkets() {
      this.$router.push({ path: '/markets', query: { class: 'kacans' }})
    }
  },
  mounted() {
    this.getPrice()
  }
}
