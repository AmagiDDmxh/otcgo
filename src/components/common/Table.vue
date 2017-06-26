<template>
  <div class="table-wrap">
    <div class="table-title">
      <slot name="table-left" class="table-left"></slot>
      <slot name="table-right" class="table-right"></slot>
    </div>
    <div v-if="showHeader" class="table-header">
      <div class="header-list" :style="{
        width: item.width || '20%'
      }" v-for="item in tableHeader">
        {{ item.label }}
      </div>
    </div>
    <div class="table-scroll">
      <table :class="['table table-bordred table-striped text-center table-hover', size]">
        <tbody>
          <tr v-for="(item, index) in dataSource" v-if="dataSource.length">
            <td :style="{
              width: items.width || '20%'
            }" v-for="items in item" v-if="items.render" :class="[items.class ? items.class : '']">
              <span v-if="!items.event">{{ items.value }}</span>
              <a v-if="items.event && !items.hide" :class="['btn-trade', items.btnClass, buttonStatus ? '' : 'disabled']" @click="buttonEvent(items.event)">
                {{ status ? items.value : '执行中' }}
              </a>
            </td>
            <td v-if="show" @click="cancel(item)"><a class="red-span bk-point-cursor">撤销</a></td>
          </tr>
          
          <tr v-if="!dataSource.length">
            <td class="table-nodata" :colspan="tableHeader.length">
              {{ nodata }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
    buttonStatus: {
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

  data () {
    return {
      status: true
    }
  },

  methods: {
    cancel (item) {
      this.$emit('cancel-click', item)
    },
    buttonEvent (fn) {
      if (typeof fn !== 'function') return console.warn('请传入方法')
      const eventCallBack = (status) => {
        console.log(status)
        this.status = status
      }
      fn(eventCallBack)
    }
  }
}
</script>

<style lang="css" scoped>
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
.btn-trade.disabled {
  background: #c9c9c9;
  border: 1px solid #f8f8f8;
  color: #fff;
  cursor: default;
}
.btn-trade.btn-blue:hover {
  background: #13ce66;
  color: #fff;
}
.btn-trade.disabled:hover {
  background: #c9c9c9;
  border: 1px solid #f8f8f8;
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
  border-top: 0;
}
.table-wrap {
  position: relative;
}
.table-header {
  display: table;
  width: 100%;
  background: #eee;
}
.header-list {
  display: table-cell;
  text-align: center;
  padding: 8px 3px;

}
.table-scroll {
  max-height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.table-scroll::-webkit-scrollbar {
    display: none;
}
.table-nodata {
  height: 100px;
  color: #009cfd;
  font-size: 20px;
  width: 100%;
}
.table-striped > tbody > tr:nth-child(add) {
  background: #fff;
}
.table-striped > tbody > tr:nth-child(even) {
  background: #f5f5f5;
}
.table-striped > tbody > tr:nth-child(odd) {
  background-color: #f9f9f9 !important;
}
.table > tbody > tr > td.table-action {
  text-align: right;
  width: 20%;
  padding-right: 40px !important;
}
</style>