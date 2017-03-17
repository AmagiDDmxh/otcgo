<template>
    <router-view></router-view>
</template>
<script>
export default {
    data() {
        return {
        }
    }
}
</script>
<style>
/*common css*/
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
   color: #fff!important;
}

.btn-lj-gree {
    background-color: #669a00;
    color: #fff;
}

.btn-lj-gree:hover {
    background-color: #568102;
    color: #fff!important;
}


/*common css*/

#app {
    font-family: 'Microsoft Yahei', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

a {
    text-decoration: none;
}

a:hover {
    text-decoration: none;
}

.pageDiv {
    min-width: 1224px;
}

.logo {
    width: 100%;
    margin: 0 auto;
}

.logo>img {
    margin: 0 10px 0 50px;
}

.navbar {
    background-color: #000 !important;
    border: none !important;
}

.container-fluid {
    width: 1200px;
    margin: 0 auto;
}

.nav {
    width: 65%;
}

ul>.frist {
    background: url(assets/ver-line.png) no-repeat left center;
}

ul>li>.menu {
    color: #fff !important;
    font-size: 1.2em;
    background: url(assets/ver-line.png) no-repeat right center;
    padding-left: 30px !important;
    padding-right: 30px !important;
}

.menu>a {
    color: inherit;
}

.search {
    display: inline-block;
}

#des {
    display: inline-block;
    height: 100%;
    line-height: 100%;
    font-weight: 500;
    font-size: 1.2
}

.container>div {
    height: 100%;
    width: 100%;
}

.msg {
    background-color: #f2f2f2;
    margin: 10px auto;
    width: 1200px;
    padding: 10px;
    border-radius: 6px;
}


.bg-blue {
    background-color: #009cff;
    width: 50px;
    height: 50px;
    display: inline-block;
    border-radius: 6px;
    background-position: center;
    background-repeat: no-repeat;
}

.foot-li {
    display: inline-block;
    font-family: '黑体';
    padding-left: 12px;
    vertical-align: top;
    padding-top: 4px;
}

.bg-li {
    background: url(assets/ver-line2.png) right center no-repeat;
}

.foot-type {
    font-size: 22px;
    font-weight: 600;
    line-height: 1;
    padding-bottom: 5px
}

.foot-des {
    font-size: 20px;
    color: #5f5f5f;
    line-height: 1
}

.list-unstyled>li {
    width: 100%;
    padding-left: 75px;
    text-align: left;
}

.text-color {
    color: #666 !important
}

.text-color2 {
    color: #9d9d9d !important
}

.text-type2 {
    font-family: "黑体"
}

.footer-link {
    background: #000;
    height: 135px!important;
    border-top: 5px solid #2c9;
    margin: 0 -15px;
    width: 1224px !important;
}
</style>
