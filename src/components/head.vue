<template>
    <!--<div id="head">
        <div class="logo">
            <div class="logo-left">
                <router-link to="/index"><img src="../assets/logo.png" alt="" /></router-link>
                <span id="des">{{ msg }}</span>
            </div>
            <div class="logo-right">
                <ul>
                    <li class="border">
                        <router-link v-if="!creationText" to="/login" id="header-a" class="header-a" target="_blank">{{
                            loginText }}
                        </router-link>
                        <router-link v-else-if="creationText" to="/login" id="header-a" class="header-a">{{ loginText
                            }}
                        </router-link>
                    </li>
                    <li>
                        <router-link v-if="!creationText" to="/creatWallet" target="_blank" class="header-a">创建钱包
                        </router-link>
                        <a v-else to="/creatWallet" class="header-a" style="text-decoration: none; color: #7c7c7c">{{
                            creationText }}</a>
                    </li>
                </ul>
            </div>
        </div>-->
        <nav class="navbar navbar-default" role="navigation">
            <!-- Collect the nav links, forms, and other content for toggling -->
            <ul class="nav navbar-nav">
                <li class="frist ">
                    <a class="menu">
                                   分类资产
                                    <ul class="menulist">
                                        <li>
                                            <router-link
                                                    class="text-center"
                                                    :to="{
                                                    path: '/bazaar',
                                                    query: { 'class': 'anscny' }
                                                }"> 小蚁股
                                            </router-link>
                                        </li>
                                        <li>
                                            <router-link
                                                    class="text-center"
                                                    :to="{
                                                    path: '/bazaar',
                                                    query: { 'class': 'anccny' }
                                                }"> 小蚁币
                                            </router-link>
                                         </li>
                                        <!-- <li><router-link>开拍币</router-link></li> -->
                                    </ul>
                                </a>
                </li>
                <li>
                    <router-link class="menu active" to="/">首 &nbsp; 页</router-link>
                </li>
                <li>
                    <a class="menu" href="http://antchain.xyz/" target="_blank">区块浏览</a>
                </li>
                <li>
                    <a class="menu"
                       href="//shang.qq.com/wpa/qunwpa?idkey=24250f89f770858cb6e518fae271a588f847f8bfdc2e604a1ef40dea20b9beae"
                       target="_blank">加入Q群</a>
                </li>
            </ul>
            <form class="navbar-form navbar-left" role="search">
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="搜索功能暂未开放" disabled>
                </div>
                <button type="submit" class="btn btn-default" disabled>
                    <span style="color:#000;text-decoration:none">搜索</span>
                </button>
            </form>
        </nav>
    </div>
</template>
<script>
export default {
    name: 'h',
    data() {
        return {
            msg: '基于智能合约的数字资产交易平台',

            loginText: "登录钱包",

            creationText: "创建钱包",

            UID: ''
        }
    },

    mounted: function() {
        if (window.LJWallet) {
            this.loginText = "我的钱包";
            this.creationText = "我的UID：" + this.UID;
            this.$http.get('uid/' + window.LJWallet.address).then((response) => {
                window.LJWallet.UID = response.data.uid;
                this.UID = response.data.uid;
            })
        }
    }
}
</script>
<style>
.btn-default a {
    text-decoration: none;
}

.carousel-control.right img {
    margin-left: -1px;
}

.header-a:hover {
    text-decoration: underline;
}

.logo {
    height: 148px;
    padding: 0 30px;
    position: absolute;
    z-index: 99;
}

.logo img {
    margin: 0 10px 0 10px;
}

.logo-left {
    float: left;
    margin: 20px;
}

.logo-right {
    float: right;
    padding: 10px 0;
    background: #fff;
    width: 60%;
    margin: 20px 0;
    border-radius: 10px;
}

.logo-right li {
    list-style: none;
    float: left;
}

.logo-right .border {
    /*border-left: 1px solid #dadada;*/
}

.logo-right .border a {
    color: #2c9;
}

.logo-right li a {
    color: #2c9;
}

.logo-right li a:hover {
    color: #2c9;
}

.navbar {
    background-color: #000 !important;
    border: none !important;
    border-radius: 0 !important;
    font-family: "微软雅黑";

}
#head nav{
    margin: 0px !important;
}

.navbar-nav .active {
    background: #009cff;
}

.form-control,
.form-group {
    width: 255px!important;
}

.container-fluid {
    width: 1200px;
    margin: 0 auto;
}

.nav {
    width: 65%;
}

.nav li {
    float: left;
}

@media (min-width: 480px) {
    .navbar-form {
        display: none;
    }
}

ul>.frist {
    background: none;
}

ul>li>.menu {
    color: #fff !important;
    font-size: 1.2em;
    background: none;
    padding-left: 30px !important;
    padding-right: 30px !important;
}

ul>li>.menu:link {
    color: #fff !important;
}

ul>li>.menu:visited {
    color: #fff !important;
}

ul>li>.menu:hover {
    color: #fff !important;
}

ul>li>.menu:active {
    color: #fff !important;
}

.navbar-nav li:hover {
    background: #009cff;
}

.navbar-nav li:hover a {
    color: #fff;
    text-decoration: none;
}

.menu:hover ul {
    display: block;
}

.menulist>li {
    list-style: none;
    background: #555;
    width: 160px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    font-size: 15px;
    border-top: 1px solid #666;
}

.menulist>li:hover {
    background: #333
}

.menulist>li:hover a {
    color: #337ab7
}

.menulist>li>a {
    color: #fff!important;
}

.menulist {
    position: absolute;
    top: 50px;
    left: 0;
    z-index: 100;
    padding: 0;
    display: none;
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

.navbar-default {
    margin: 15px!important;
}

.navbar-collapse {
    padding: 0;
}
</style>
