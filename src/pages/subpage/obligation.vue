<template>
    <div class="obligation">
        <table class="table data-table table-bordred table-striped">
            <thead>
                <th>资产类型 </th>
                <th>购买数量</th>
                <th>购买单价/CNY</th>
                <th>总计/CNY</th>
                <th class="tb-btn">
                </th>
            </thead>
            <tbody>
                <tr>
                    <td>小蚁币</td>
                    <td>10000.25</td>
                    <td>0.95</td>
                    <td>
                        95000
                    </td>
                    <td style="width:330px">
                        <div v-if="settled == 1">
                            <span class="settled-icon">
                        	<img  width="20px"src="../../assets/yes.png"/>
                        </span>
                            <span style="font-size:12px"> 结算成功！几秒后可在资产列表中查询。</span>
                        </div>
                        <button
                                v-if="settled == 0"
                                class="btn ljbutton"
                                v-on:click="settleAccounts">结算
                        </button>
                        <!-- -1-->
                        <div v-if="settled == -1">
                            <button class="btn ljbutton" v-on:click="settleAccounts">结算</button>
                            <span style="font-size:13px"> 你的账户人民币不足，请<a href="#" >充值</a>！</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {

    data() {
            return {
                settled: -1
            }
        },
        methods: {
            settleAccounts: function(event) {
                this.settled = 1;
            }
        }


}
</script>
<style lang="css">
.obligation {}
</style>
