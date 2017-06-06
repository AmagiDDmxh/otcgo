<template>
  <svg :class="className" :height="height" width="width">
    <use :xlink:href="glyph"></use>
  </svg>
</template>

<script>
  export default {
    name: 'icon',
    props: [
      'className',
      'glyph',
      'height',
      'width'
    ]
  }
</script>

<style lang="css" scoped>
  .icon {
    display: inline-block;
  }
</style>
