<template>
  <div class="container-padding">
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
              <li>
                <router-link
                    class="text-center"
                    :to="{ path: '/admin/balances'}"
                > 资产列表
                </router-link>
              </li>
              <li>
                <router-link :to="{ path: '/admin/order', query: { type: 'sell'}}" class=" sub-li-title text-center" v-on:click="order_sub_li=!order_sub_li"> 我的挂单 </router-link>
              </li>

              <li>
                <a class="sub-li-title text-center" @click="history_sub_li = !history_sub_li">历史交易记录</a>
              </li>
              <template v-if="history_sub_li">
                <li class="sub-li">
                  <router-link class="text-center"
                               :to="{ path: '/admin/history/transfer' }">转账记录</router-link>
                </li>

                <li class="sub-li">
                  <router-link class="text-center"
                               :to="{ path: '/admin/history/transaction' }">交易记录
                  </router-link>
                </li>
              </template>
              <li>
                <a class="text-center" href="//antchain.xyz" target="_blank">区块浏览</a>
              </li>
              <li>
                <router-link class="text-center" :to="{ path: '/admin/uid'}">个人中心</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-xs-9">
        <!-- data-table -->
        <div class="admin-content">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-3">
      </div>
      <div class="col-xs-9">
        <div class="admin-footer-line">离线钱包由小蚁区块链提供技术支持</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        order_sub_li: false,
        history_sub_li: false
      }
    }
  }
</script>

<style lang="css">
  .container-padding {
    margin-top: 15px;
    padding: 0 32px;
    color: #747474;
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
    color: #009cfd;
  }

  /*left-menu*/

  .left-menu .nav {
    font-size: 16px;
    width: 100%;
  }

  .left-menu .nav .title {
    background: #009cff;
    color: #fff;
  }

  .left-menu .nav li a {
    border-radius: 0;
    background: #f2f2f2;
  }

  .admin-footer-line {
    margin-top: 20px;
    border-top: 1px solid #ccc;
    color: #b1b1b1;
  }

  .left-menu .nav li a {
    color: #626262;
    font-weight: normal;
  }

  .sub-li-title {
    cursor: pointer;
  }

  .sub-li a {
    background-color: #fff !important;
    color: #939393 !important;
  }

  .admin-tips li {
    margin-bottom: 0;
  }

  .nav-stacked > li {
    float: none;
  }
</style>
