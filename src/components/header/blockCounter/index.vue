<template>
  <div>
    <li>
      <a class="block__high">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.24 5.81" height="25">
          <g id="block" data-name="block">
            <path class="block-cls-1" d="M5.09 4.18l-2.4 1.49L.17 4.2l2.39-1.48 2.53 1.46z"/>
            <path class="block-cls-1" d="M5.08 2.91l-2.4 1.48L.16 2.93l2.39-1.48 2.53 1.46z"/>
            <path class="block-cls-1" d="M5.07 1.61l-2.4 1.48L.15 1.63 2.55.15l2.52 1.46z"/>
          </g>
        </svg>
        {{ blockHigh }}
      </a>
    </li>
    <li class="block">
      <a class="block__time">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4.36 4.36" height="20">
          <g id="clock" data-name="clock">
            <circle class="cls-1" cx="2.18" cy="2.18" r="2.06"/>
            <polyline class="cls-2" points="2.75 3.01 2.07 2.33 2.07 1.22"/>
          </g>
        </svg>
        {{ blockTime }}
      </a>
    </li>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      blockTime: 0,
      ...mapGetters(['blockHigh'])
    }),

    watch: {
      blockHigh() { this.blockTime = 0 }
    },

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
    },

    destroyed() {
      clearInterval(this.counter)
      clearInterval(this.getHighTimer)
    }
  }
</script>

<style lang="stylus" scoped>

  .block
    color: #6b6b6b
    .block__high
      margin-right: 30px

  .cls-1, .cls-2 {
    fill: none;
    stroke: #6b6b6b;
  }

  .cls-1 {
    stroke-miterlimit: 10;
    stroke-width: 0.25px;
  }

  .cls-2 {
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 0.2px;
  }

  .block-cls-1 {
    fill: #6b6b6b;
    stroke: #fff;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: .3px
  }

  .vue-icon path[pid="0"]
    fill: none
</style>