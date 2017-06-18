<template>
  <div class="table-wrap">
    <div class="table-title">
      <slot name="table-left" class="table-left"></slot>
      <slot name="table-right" class="table-right"></slot>
    </div>
    <table :class="['table table-bordred table-striped text-center table-hover', size]">
      <thead v-show="tableHeader.length" :class="['table-head', showHeader ? '' : 'hide-table']">
        <tr>
          <th v-for="label in tableHeader">{{ label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in dataSource" v-if="dataSource.length">
          <td v-if="trade">
            <span :class="type === 'buy' ? 'red-span' : 'green-span'">
              {{ type === 'buy' ? `买${index}` : `卖${index}` }}
            </span>
          </td>
          <td v-for="items in item" v-if="items.render" :class="[items.class ? items.class : '']">{{ items.value }}</td>
          <td v-if="show" @click="cancel(item)"><a class="red-span bk-point-cursor">撤销</a></td>
          <td v-if="trade" @click="cancel(item)">
            <a :class="['btn-trade', type === 'buy' ? 'btn-blue' : 'btn-red']">
              {{ type === 'buy' ? '卖出' : '买入'}}
            </a>
          </td>
        </tr>
        <tr v-if="!dataSource.length">
          <td class="table-nodata" :colspan="tableHeader.length">
            {{ nodata }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'table',
  props: {
    tableHeader: {
      type: Array,
      default: () => []
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    trade: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    padding: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'sell'
    },
    nodata: {
      type: String,
      default: '暂无数据'
    }
  },
  methods: {
    cancel (item) {
      this.$emit('cancel-click', item)
    }
  }
}
</script>

<style lang="css">
.table-title {
  overflow: hidden;
  background: #fff;
}
.table-title > .table-left {
  float: left;
}
.table {
  margin-bottom: 0;
}
.hide-table {
  visibility: hidden;
  height: 0;
}
.table-title > .table-right {
  float: right;
}
.table-head {
  background-color: #eee;
}
.table-head > tr > th {
  text-align: center;
}
.btn-trade {
  border-radius: 5px;
  padding: 3px 15px;
  background: #fff;
  cursor: pointer;
}
.btn-trade.btn-red {
  border: 1px solid #ff4949;
  color: #ff4949;
}
.btn-trade.btn-red:hover {
  background: #ff4949;
  color: #fff;
}
.btn-trade.btn-blue {
  border: 1px solid #13ce66;
  color: #13ce66;
}
.btn-trade.btn-blue:hover {
  background: #13ce66;
  color: #fff;
}
.table.table-lg > thead > tr > th,
.table.table-lg > tbody > tr > th,
.table.table-lg > tfoot > tr > th,
.table.table-lg > thead > tr > td,
.table.table-lg > tbody > tr > td,
.table.table-lg > tfoot > tr > td {
  padding: 15px 8px !important;
}
.table > thead > tr > th,
.table > tbody > tr > th,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > tbody > tr > td,
.table > tfoot > tr > td {
  padding: 8px 3px !important;
}
.table-nodata {
  height: 100px;
  color: #009cfd;
  font-size: 20px;
  width: 100%;
}
</style>