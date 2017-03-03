<template>
    <div class="container-padding">
        <div class="panel panel-default panel-state">
            <div class="panel-body">
                <span class="link-span">{{name}} 交易区</span>
            </div>
        </div>
        <div class=" row">
            <div class="col-xs-3 col-lg-3">
                <div class="ad-tips">
                    <div class="tips-title">交易指南</div>
                    <div style="background-color:#f2f2f2; color:#928f8c; padding:20px 15px">
                        <p style="margin-bottom:20px">
                            请
                            <router-link to="/login" target="_blank"> 登录个人钱包</router-link>
                            创建交易订单。
                        </p>
                        <p>
                            登录个人钱包后，点击“资产列表”
                        </p>
                        <p>
                            中该类资产的“交易”功能，
                        </p>
                        <p>
                            完成订 单的创建。
                        </p>
                    </div>
                </div>
            </div>
            <div class="content col-xs-9 col-lg-9" style="height:auto">
                <!-- table-list -->
                <table class="table table-js  table-striped" style="margin-top:64px">
                    <thead>
                        <th>{{name}} </th>
                        <th>数量</th>
                        <th>单价 CNY</th>
                        <th>总价</th>
                        <th class="th-bar">
                        </th>
                    </thead>
                    <tbody>
                        <tr v-for="item in sellList">
                            <td class="sell-name"> {{ item.name }}</td>
                            <td> {{ item.amount }}</td>
                            <td>{{ item.price }}</td>
                            <td>
                                {{ (item.amount * item.price).toFixed(4) }}
                            </td>
                            <td class="amount-tb-bar" style="width:200px;">
                                <div class=" amount-bar amount-bar-sell" v-bind:style="{width: (item.amount/ amountMax)*100+ '%'}"></div>
                            </td>
                        </tr>
                        <!-- tr -->
                        <tr>
                            <td>&nbsp;</td>
                            <td> </td>
                            <td></td>
                            <td>
                            </td>
                            <td class="tb-bar">
                            </td>
                        </tr>
                        <tr v-for="item in buyList">
                            <td class="buy-name"> {{ item.name }}</td>
                            <td> {{ item.amount }}</td>
                            <td>{{ item.price }}</td>
                            <td>
                                {{ (item.amount * item.price).toFixed(4) || '' }}
                            </td>
                            <td class="amount-tb-bar" style="width:200px;">
                                <div class=" amount-bar amount-bar-buy" v-bind:style="{width: (item.amount/ amountMax)*100+ '%'}"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p class="tips">
                     离线钱包由小蚁区块链提供技术支持
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {

    data() {
            return {
                buyList: [],  // 买单列表
                sellList: [],  // 卖单列表
                amountMax: 0,
                name: ""
            }
        },

    watch: {
        '$route' (to, from) {
            this.$route.query.class == 'anscny' ? this.name = '小蚁股' : this.name = '小蚁币'
            this.get_rder_book(to.query.class);

        }
    },

    methods: {

        get_rder_book: function (type) {
            Array.prototype.max = function () {
                return Math.max.apply({}, this)
            };

            var buyname = ["买一", "买二", "买三", "买四", "买五", "买六", "买七", "买八", "买九", "买十"];
            var sellname = ["卖十", "卖九", "卖八", "卖七", "卖六", "卖五", "卖四", "卖三", "卖二", "卖一"];
            buyname.map((name, index) => {
                this.buyList[index] = {name}
            });
            sellname.reverse().map((name, index) => {
                this.sellList[index] = {name}
            });

            this.$http.get('order_book/' + type + '/')
                .then((response) => {

                    this.buyList.map(function (obj, betaHome) {
                        var sort = response.data.bids.sort((cur, pre) => cur.price < pre.price ? 1 : -1);
                        obj.amount = typeof sort[index] == 'undefined' ? '' : sort[index].amount;
                        obj.price = typeof sort[index] == 'undefined' ? '' : sort[index].price;
                    });

                    this.sellList.map(function (obj, betaHome) {
                        var sort = response.data.asks.sort((cur, pre) => cur.price < pre.price ? 1 : -1);
                        obj.amount = typeof sort[index] == 'undefined' ? '' : sort[index].amount;
                        obj.price = typeof sort[index] == 'undefined' ? '' : sort[index].price;
                    });

                    // 取两个数组的最大
                    var amountArray = [];
                    for (var i = 0; i < this.buyList.length; i++) {
                        amountArray.push(this.buyList[i]['amount']);
                    }
                    for (var i = 0; i < this.sellList.length; i++) {
                        amountArray.push(this.sellList[i]['amount']);
                    }
                    this.amountMax = amountArray.max();
                }, (response) => {
                    this.$message.error('获取集市买(卖)单错误');
                    throw response;
                });
        }
    },

    mounted: function () {
        this.name = this.$route.query.class == 'anscny' ? '小蚁股' : '小蚁币';
        this.get_rder_book(this.$route.query.class);
    }

}
</script>
<style lang="css">
.tips-title {
    width: 100%;
    height: 40px;
    background: #2c9;
    color: #fff;
    line-height: 40px;
    text-align: center;
}

.baz-from {
    margin-top: 60px;
    margin-bottom: 12px;
    padding-left: 53px;
}

.baz-from .form-group {
    width: auto!important;
    padding: 0 10px;
}

.baz-from .form-group input {
    width: 176px!important;
}

.table-js th {
    background-color: #eeeeee;
    padding: 10px 0px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding-left: 26px!important;
    color: 636363;
}

.table-js tr td {
    border-top: none!important;
    padding-left: 26px!important;
    color: 636363;
}

.table-js.table-striped>tbody>tr:nth-child(even) {
    background-color: #f8f8f8;
}


/*amount-bar*/

.amount-tb-bar {
    padding-left: 0px!important;
}

.amount-bar {
    height: 20px;
}

.amount-bar-buy {
    background: #E48786;
}

.amount-bar-sell {
    background: #AEC764;
}


.sell-name{
    color: #AEC764;
}
.buy-name{
    color:  #E48786;
}
</style>
