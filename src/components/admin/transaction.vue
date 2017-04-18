<template>
  <el-dialog id="dialogTransaction">
    <div class="row">
      <div class="col-xs-2">小蚁币：</div>
      <div class="col-xs-3">可用: <span class="blue-span">2386.00</span></div>
      <div class="col-xs-3">冻结: <span class="blue-span">2386.00</span></div>
      <div class="col-xs-3">最新成交价: <span class="blue-span">{{current_price}}</span></div>
    </div>
    <div class="row" style="margin-top:15px">
      <div class="col-xs-2">人民币：</div>
      <div class="col-xs-3">可用: <span class="blue-span">2386.00</span></div>
      <div class="col-xs-3">冻结: <span class="blue-span">2386.00</span></div>
    </div>
    <hr/>
    <div class="row" style="margin-top:30px">
      <div class="col-xs-6">
        <div class="row">
          <div class="col-xs-3" style="line-height: 30px;">买入量：</div>
          <div class="col-xs-6">
            <input type="text" class="form-control" placeholder="输入数量"
                   v-model.number="buyNumValue" style="width:100%!important"/>
          </div>
          <div class="col-xs-3" style="line-height: 30px;">
            <span v-if=" buyNumValue =='' || isNaN(parseInt(buyNumValue))"
                  class="error-text">数量错误</span>
            <span v-else> <img :src="img.yes"/> </span>
          </div>
        </div>
        <div class="row" style="margin-top:10px">
          <div class="col-xs-3" style="line-height: 30px;">买入价：</div>
          <div class="col-xs-6">
            <input type="text" class="form-control" placeholder="输入价格"
                   v-model="buyPriceValue" style="width:100%!important"/>
          </div>
          <div class="col-xs-3" style="line-height: 30px;">
            <span v-if=" buyPriceValue =='' || isNaN(parseInt(buyPriceValue))  "
                  class="error-text">数量错误</span>
            <span v-else> <img :src="img.yes"/> </span>
          </div>
        </div>
        <div class="row" style="margin-top:10px">
          <div class="col-xs-3" style="line-height: 30px;"></div>
          <div class="col-xs-6">
            <button class="btn btn-lj-red btn-block" @click="buy">买入</button>
          </div>
        </div>
      </div>
      <div class="col-xs-6" style="padding-left:40px;border-left:solid 1px #ccc;">
        <div class="row">
          <div class="col-xs-3" style="line-height: 30px;">卖出量：</div>
          <div class="col-xs-6">
            <input
                type="text" class="form-control" placeholder="输入数量"
                v-model="sellNumValue" style="width:100%!important"/>
          </div>
          <div class="col-xs-3" style="line-height:30px;">
            <span v-if=" sellNumValue =='' || isNaN(parseInt(sellNumValue))  "
                  class="error-text">数量错误</span>
            <span v-else> <img :src="img.yes"/> </span>
          </div>
        </div>
        <div class="row" style="margin-top:10px">
          <div class="col-xs-3" style="line-height: 30px;">卖出价：</div>
          <div class="col-xs-6">
            <input type="text" class="form-control"
                   v-model="sellPriceValue" style="width:100%!important" placeholder="输入价格"/>
          </div>
          <div class="col-xs-3" style="line-height: 30px;">
            <span v-if=" sellPriceValue =='' || isNaN(parseInt(sellPriceValue))"
                  class="error-text">数量错误</span>
            <span v-else> <img :src="img.yes"/> </span>
          </div>
        </div>
        <div class="row" style="margin-top:10px">
          <div class="col-xs-3" style="line-height: 30px;"></div>
          <div class="col-xs-6">
            <button class="btn btn-lj-gree btn-block" @click="sell">卖出</button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: ['img', 'current_price', 'buyNumValue', 'buyPriceValue', 'buy', 'sellNumValue', 'sellPriceValue', 'sell']
  }
</script>

<style lang="css" scoped>

</style>