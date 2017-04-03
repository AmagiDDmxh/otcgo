export default {
  data() {
    return {
      firstButton: ['oContent__tab', 'btn', {'oContent__tab--active': true}],
      secondButton: ['oContent__on-tab', 'btn', {'oContent__on-tab--active': false}],
      contentOne: true,
      contentTwo: false
    }
  },
  methods: {
    switchOne(e) {
      e.target.classList.add('oContent__tab--active')
      if (e.target.previousSibling) {
        e.target.previousSibling.classList.remove('oContent__tab--active');
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
        e.target.previousSibling.classList.remove('oContent__tab--active');
      }
      if (e.target.nextSibling) {
        e.target.nextSibling.classList.remove('oContent__on-tab--active')
      }
      this.contentOne = false
      this.contentTwo = true
    }
  }
}
/**
 * Created by Administrator on 4/3/2017.
 */
