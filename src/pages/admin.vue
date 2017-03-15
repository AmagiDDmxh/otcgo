<template>
    <div class="admin-group">
        <div class="container">
            <counter></counter>

            <div class="container container-padding">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="panel panel-default panel-state">
                            <div class="panel-body">
                                你已登录离线钱包
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <!-- left menu -->
                    <div class="col-xs-3">
                        <div class="ad-tips admin-tips">
                            <div class="left-menu">
                                <ul class="nav nav-pills nav-stacked">
                                    <li><a class="text-center title">菜&nbsp;&nbsp;&nbsp;单</a></li>
                                    <li :class="{'active': isActive}">
                                        <router-link
                                                class="text-center"
                                                :to="{ path: '/admin/balances'}"
                                        > 资产列表
                                        </router-link>
                                    </li>
                                    <li>
                                        <a class="text-center" href="//testnet.antchain.xyz/" target="_blank">区块浏览</a>
                                    </li>
                                    <li>
                                        <router-link class="text-center" :to="{path: '/admin/history'}">转账记录</router-link>
                                    </li>
                                    <li>
                                        <router-link class="text-center" :to="{ path: '/admin/uid'}"> 个人中心</router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-9">
                        <!-- data-table -->
                        <router-view>
                        </router-view>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-3">
                    </div>
                    <div class="col-xs-9">
                        <div class="admin-footer-line">
                            离线钱包由小蚁区块链提供技术支持
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import counter from '../components/blockChainCounter.vue'
    
    export default {
        data() {
            return {
                sub_li: false,
                isActive: false,
                blockchainHeight: NaN,
            }
        },
 
        components: {
            counter
        }
    }
</script>


<style lang="css">
.admin {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.exit {
    position: absolute;
    right: 0;
    top: -35px;
}

.exit__button {
    background: #22cc99;
    color: #fff;
}

.container-padding {
    margin-top: 15px;
    padding: 32px;
    color:#747474;
}

.panel-state {
    height: 35px !important;
    border: none;
    background-color: #f2f2f2;
}

.panel-state .panel-body {
    height: 100%;
    padding-top: 6px;
    padding-bottom: 5px;
    padding-left: 27px;
    padding-right: 27px;
    background-color: #f2f2f2;
    color: #2c9;
}

/*left-menu*/

.left-menu .nav {
    font-size: 16px;
    width: 100%;
}

.left-menu .nav .title {
    background: #2c9;
    color: #fff;
}

.left-menu .nav .title:hover {
    color: #fff;
    background: #2c9;
}

.left-menu .nav li a {
    border-radius: 0px;
    background: #f2f2f2;
}

.left-menu .nav li a:hover {
    background: #e3e3e3;
}

.admin-footer-line {
    margin-top: 20px;
    border-top: 1px solid #ccc;
    color: #b1b1b1;
}

.left-menu .nav li a {
    color: #939393;
    font-weight: normal;
}

.sub-li-title {
    cursor: pointer;
}

.sub-li a {
    background-color: #fff!important;
}

.admin-tips li {
    margin-bottom: 0px;
}
</style>
