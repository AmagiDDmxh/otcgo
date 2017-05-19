<template>
  <div class="obligation">
    <table class="table data-table table-bordred table-striped">
      <thead>
        <th>资产名称</th>
        <th>购买数量</th>
        <th>购买单价/CNY</th>
        <th>总计/CNY</th>
        <th class="tb-btn"></th>
      </thead>
      <tbody>
      <tr v-for="item in cart">
        <td>{{item.name}}</td>
        <td>{{item.amount}}</td>
        <td>{{item.price}}</td>
        <td>{{item.total}}</td>

        <td style="width:330px">
          <template v-if="item.valid">
            <button class="btn ljbutton" v-on:click="settleAccounts(item.id)">结算</button>
          </template>
          <div v-if="item.done">
            <span class="settled-icon">
              <img src="../../../images/yes.png"/>
            </span>
            <span style="font-size:12px"> 结算成功！几秒后可在资产列表中查询。</span>
          </div>
          <div v-else-if="!item.valid">
            <span style="font-size:13px"> 你的账户人民币不足，请<router-link to="/admin/balances">充值</router-link>！</span>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters(['cart'])
    },
    methods: {
      settleAccounts: function (id) {
        this.$store.dispatch('CHECKOUT', {id, hex_pubkey: window.LJWallet['publicKey']})
      }
    }
  }
</script>

<style lang="css">
  .obligation {
  }
</style>
