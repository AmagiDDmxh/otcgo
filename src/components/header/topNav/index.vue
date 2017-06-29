<style lang="stylus" src="./topNav.styl" scoped></style>

<template>
  <div id="topNav" class="navbar navbar-default navbar-static-top accounts topNav">

    <div class="navbar-header">
      <!--<a class="btn btn-default navbar-toggle collapsed" data-toggle="collapse" data-target=".account-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </a>-->
    </div>

    <div class="navbar-collapse account-collapse collapse">
      <div class="container-fluid">
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a href="//antchain.xyz" target="_blank">
              <el-button :plain="true" type="primary">区块浏览</el-button>
            </a>
          </li>

          <li>
            <a class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.24 5.81" height="24">
                <g id="block" data-name="block">
                  <path class="cls-1" d="M5.09 4.18l-2.4 1.49L.17 4.2l2.39-1.48 2.53 1.46z"/>
                  <path class="cls-1" d="M5.08 2.91l-2.4 1.48L.16 2.93l2.39-1.48 2.53 1.46z"/>
                  <path class="cls-1" d="M5.07 1.61l-2.4 1.48L.15 1.63 2.55.15l2.52 1.46z"/>
                </g>
              </svg>
              {{ blockHeight }}
            </a>
          </li>

          <li>
            <a class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4.36 4.36" height="20">
                <g id="clock" data-name="clock">
                  <circle class="cls-1" cx="2.18" cy="2.18" r="2.06"/>
                  <polyline class="cls-2" points="2.75 3.01 2.07 2.33 2.07 1.22"/>
                </g>
              </svg>
              {{blockTime}}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'topNav',

    computed: mapGetters(['blockHeight']),

    data: () => ({
      blockTime: 0
    }),

    methods: {
      getCount() {
        this.$store.dispatch('GET_BLOCK')
      },
      run() {
        this.counter = setInterval(() => this.blockTime++, 1000)
        this.getHighTimer = setInterval(() => this.getCount(), 2000)
      }
    },

    mounted() {
      this.getCount()
      this.run()
      this.$store.watch(state => state.blockHeight, () => { this.blockTime = 0 })
    },

    destroyed() {
      clearInterval(this.counter)
      clearInterval(this.getHighTimer)
    }
  }
</script>
