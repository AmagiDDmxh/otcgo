<template>
  <div class="page-index">
    <div class="index">
      <el-carousel :interval="5000" arrow="always" height="400px">
        <el-carousel-item v-for="item in imgs">
          <img :src="item" alt="">
        </el-carousel-item>
      </el-carousel>

      <!-- TODO: improve the nav-bar section -->
      <!--<el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">

          <el-table :data="cnyData">
            <el-table-column prop="equityCode" label="权益代码"></el-table-column>
            <el-table-column prop="name" label="资产名称"></el-table-column>
            <el-table-column prop="type" label="资产类型"></el-table-column>
            <el-table-column prop="publisher" label="发行方"></el-table-column>
            <el-table-column prop="price" label="最新价格CNY"></el-table-column>
          </el-table>

        </el-tab-pane>

        <el-tab-pane label="配置管理" name="second">
          <el-table :data="ansData">
            <el-table-column prop="equityCode" label="权益代码"></el-table-column>
            <el-table-column prop="name" label="资产名称"></el-table-column>
            <el-table-column prop="type" label="资产类型"></el-table-column>
            <el-table-column prop="publisher" label="发行方"></el-table-column>
            <el-table-column prop="price" label="最新价格CNY"></el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>

      <span v-text="activeName"></span>-->

      <o-content></o-content>
    </div>
  </div>
</template>

<script>
  import oContent from '../components/common/oContent/index.vue'
  export default {
    components: { oContent },
    data: () => ({
      imgs: [require('../assets/banner_1.png'), require('../assets/slide2.png'), require('../assets/slide3.png')],
      activeName: 'first',
      cnyData: [{
        equityCode: '00001',
        name: '小蚁股ANS',
        type: '股权',
        publisher: '小蚁开发团队',
        price: '0.02'
      }, {
        equityCode: '00002',
        name: '小蚁币ANC',
        type: '消费权',
        publisher: '小蚁开发团队',
        price: '0.02'
      }],
      ansData: [{
        equityCode: '00003',
        name: '开拍币',
        type: '股权\\消费权',
        publisher: '小蚁开发团队',
        price: '0.02'
      }]
    }),
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      active(e) {
        console.log(e.target)
        // this.activeName = e.target.innerText
      }
    }
  }
</script>

<style lang="stylus">
  .el-table__body
    text-align: center

  .el-table__header .is-leaf
    text-align: center

  .el-carousel__item img
    width: 100%
    height: 400px

  .el-carousel__container > button
    display: none

/*  .carousel-control
    background: #8e8e8e;
    height: 100px;
    line-height: 100px;
    font-size: 50px !important;
    width: 51px !important;
    margin-top: 140px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0);
    background-image: none;

  .carousel-inner img
    width: 100%;
    height: 400px;*/
</style>
