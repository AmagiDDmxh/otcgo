<template>
  <div class="wrapper">
    <div class="top-nav" :class="{ expand: scrolled, opened: navOpen }">
      <div class="nav-items hidden-xs">
        <ul>
          <!-- <li><router-link to="/articles">文章</router-link></li> -->
          <li><router-link to="/designGuide" active-class >设计指南与资源</router-link></li>
        </ul>
      </div>
      <div class="nav-items visible-xs">

      </div>
      <div class="nav-full visible-xs" :class="{ visible: navOpen }">
        <ul>
          <!-- <li><router-link to="/articles">文章</router-link></li> -->
          <li><router-link to="/designGuide" active-class >设计指南与资源</router-link></li>
          <li><router-link to="/career" active-class >工作机会</router-link></li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'topNav',
    data: () => ({
      scrolled: false,
      navOpen: false
    }),

    mounted() {
      window.addEventListener('scroll', this.handleScroll)
    },

    methods: {
      handleScroll() {
        this.scrolled = window.scrollY > 40
      },
      navTriggerClick() {
        this.navOpen = !this.navOpen
      }
    }
  }
</script>

<style lang="css" scoped>@import "~styles/variables";


</style>
