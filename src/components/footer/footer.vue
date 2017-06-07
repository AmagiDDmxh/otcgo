<template lang="html">
    <div id="footer">
        <div class="row footer-top" >
            <div class="col-lg-3 col-sm-3 col-md-3 bg-li">
                <span class="bg-blue  bg-blue1">
          </span>
                <div class="foot-li" style="">
                    <p class="foot-type">资金无忧</p>
                    <p class="foot-des">智能合约点对点结算</p>
                </div>
            </div>
            <div class="col-lg-3 col-sm-3 col-md-3 bg-li">
                <span class="bg-blue  bg-blue2">
          </span>
                <div class="foot-li" style="">
                    <p class="foot-type">快捷撮合</p>
                    <p class="foot-des">无确认的信息撮合效率</p>
                </div>
            </div>
            <div class="col-lg-3 col-sm-3 col-md-3 bg-li">
                <span class="bg-blue bg-blue3">
          </span>
                <div class="foot-li" style="">
                    <p class="foot-type">更低费率</p>
                    <p class="foot-des">交易手续费全网最低</p>
                </div>
            </div>
            <div class="col-lg-3 col-sm-3 col-md-3 bg-li" style="background-image:none">
                <span class="bg-blue bg-blue4">
          </span>
                <div class="foot-li" style="">
                    <p class="foot-type">自动分红</p>
                    <p class="foot-des">保障投资人的分红收益</p>
                </div>
            </div>
        </div>
        <hr class="cut-line"/>
        <div class="row">
            <div class="col-lg-12 col-md-12">
                <div class="row about">
                    <div class="col-lg-10 col-md-10  row">
                        <div class="col-lg-3  col-md-3 text-center">
                            <h4 class="text-color text-type2">合作伙伴</h4>
                            <!--  <ul class="list-unstyled">
                      <li><router-link class="text-color2" to="/time-entries">小蚁区快链</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">评级公司</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">众筹平台</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">巴比特</router-link></li>
                    </ul> -->
                        </div>
                        <div class="col-lg-3 col-md-3 text-center">
                            <router-link to="/about">
                              <h4 class="text-color text-type2">了解我们</h4>
                            </router-link>
                            <!--  <ul class="list-unstyled">
                      <li><router-link class="text-color2" to="/time-entries">了解小蚁</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">什么是OTC</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">OTC优势</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">联系我们</router-link></li>
                    </ul> -->
                        </div>
                        <div class="col-lg-3 col-md-3 text-center">
                            <h4 class="text-color text-type2">帮助中心</h4>
                            <!--  <ul class="list-unstyled">
                    <li><router-link class="text-color2" to="/time-entries">投资流程</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">挂单流程</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">客服中心</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">常见问题</router-link></li>
                    </ul> -->
                        </div>
                        <div class="col-lg-3 col-md-3 text-center">
                            <h4 class="text-color text-type2">友情链接</h4>
                            <!--  <ul class="list-unstyled">
                      <li><router-link class="text-color2" to="/time-entries">小蚁官网</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">BB评级</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">天使汇</router-link></li>
                    <li><router-link class="text-color2" to="/time-entries">比特时代</router-link></li>
                    </ul> -->
                        </div>
                    </div>
                    <div class="col-lg-2 text-center">
                        <h4 class="text-color text-type2">微信订阅号</h4>
                        <img :src="require('~images/QRcode.jpg')" alt="QRcode" class="qrCode" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {}
</script>
<style lang="css">
.qrCode {
  width: 100px;
}

#footer {
    background-color: #eee;
    width: 1224px;
}
.footer-top{
    padding: 80px;
}

.cut-line {
    margin: 0 auto;
    border-color: #e9e9e9;
    width: 95%;
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

.bg-blue1 {
    background-image: url(../../images/foot-1.png);
}

.bg-blue2 {
    background-image: url(../../images/foot-2.png);
}

.bg-blue3 {
    background-image: url(../../images/foot-3.png);
}

.bg-blue4 {
    background-image: url(../../images/foot-4.png);
}

.foot-li {
    display: inline-block;
    font-family: '黑体';
    padding-left: 12px;
    vertical-align: top;
    padding-top: 4px;
}

.bg-li {
    background: url(../../images/ver-line2.png) right center no-repeat;
}

.foot-type {
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    padding-bottom: 5px;
    font-family: "微软雅黑"
}

.foot-des {
    font-size: 16px;
    color: #5f5f5f;
    line-height: 1;
    font-family: "微软雅黑"
}

.list-unstyled>li {
    width: 100%;
    padding-left: 75px;
    text-align: left;
}

.list-unstyled a:hover {
    color: #009cff!important;
    text-decoration: none;
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

.about {
    margin: 37px 0 60px 0;
}
</style>
