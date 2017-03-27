<template>
  <router-view></router-view>
</template>

<script>
  export default {

  }
</script>

<style>
  .error-text {
    color: red;
    margin: 0px;
    text-indent: 5px;
  }

  .btn-lj-red {
    background-color: #ff0000;
    color: #fff;
  }

  .btn-lj-red:hover {
    background-color: #ea0303;
    color: #fff !important;
  }

  .btn-lj-gree {
    background-color: #669a00;
    color: #fff;
  }

  .btn-lj-gree:hover {
    background-color: #568102;
    color: #fff !important;
  }

  /*common css*/

  body {
    font-family: 'Microsoft Yahei', 'Avenir', Helvetica, Arial, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: none;
  }

  .menu > a {
    color: inherit;
  }

  .container > div {
    height: 100%;
    width: 100%;
  }

  .list-unstyled > li {
    width: 100%;
    padding-left: 75px;
    text-align: left;
  }
</style>
