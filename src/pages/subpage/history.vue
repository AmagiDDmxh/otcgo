<template>
        <div>
            <table class="table data-table table-bordred table-striped">
                <thead>
                    <th>对方地址</th>
                    <th>资产类型</th>
                    <th>资产数量</th>
                    <th>转账时间</th>
                    <th style="width: 120px;"></th>
                </thead>
                <tbody>
                    <tr v-for="history in historys">
                        <td>{{history['dest']}}</td>
                        <td>{{history['name']}}</td>
                        <td>{{history['amount']}}</td>
                        <td>{{history['time']}}</td>
                        <td>查看<a class="link-span" :href="`https://testnet.antchain.xyz/tx/hash/${history['txid']}`" target="_blank">转出记录</a></td>
                    </tr>
                </tbody>
            </table>
            <!-- TODO: They is the paging -->
            <!-- <div class="row">
                <div class="col-xs-12">
                    <div class="pull-right">
                        <select class="form-control boot-select">
                                <option ></option>
                        </select>
                        <ul class="pagination pagePath pull-right">
                            TODO: 每页展示7行信息（7行资产品类、7行挂单、7行成交记录等）。当用户的某菜单栏信息超过7行时，才出现这样的页面按钮。没有超过7行的，不用展示按钮（或只展示第一页）。

                            <li class="active"><a href="#">1</a></li>
                            <li><a href="#">2</a></li>
                            <li><a href="#">3</a></li>
                        </ul>
                    </div>
                </div>
            </div> -->
        </div>
</template>

<script>

export default {
    data() {
        return {
            historys: []
        }
    },

    methods: {
        getHistorys() {
                this.$http.get(`balances/transfer/history/${window.LJWallet.address}/`).then((response) => {
                    this.historys = response.data.data;
                }, (response) => {
                    this.$message.error("获取转账记录失败, 请稍候再试!");
                });
            }
    },

    mounted() {
        this.getHistorys()
    }
}

</script>

<style>
.boot-select {
    float: left;
    margin: 20px 0;
}
</style>