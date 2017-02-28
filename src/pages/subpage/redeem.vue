<template>
    <div class="obligation">
        <button class="btn ljbutton" style="float: right; margin: -60px 30px;" @click="get_redeem_operation()">一键取回
        </button>
        <table class="table data-table table-bordred table-striped">
            <thead>
            <th>资产类型</th>
            <th>成交数量</th>
            <th>成交价/CNY</th>
            <th>成交时间</th>
            <th>资产状态</th>
            <th class="tb-btn">
            </th>
            </thead>
            <tbody>
            <tr :class="{'redeem-text': !item.redeem}" v-for="item in listData">
                <td> {{ item.name }}</td>
                <td> {{ item.amount }}</td>
                <td> {{ item.price }}</td>
                <td> {{ item.time }}</td>
                <td> {{ item.redeem ? '已取回' : '未取回' }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                listData: [],
                tempAccess: false
            }
        },
        methods: {
            get_redeem_order() {
                this.$http.get(`redeem/${window.LJWallet['address']}/`)
                    .then((res) => {
                        this.listData = res.data;
                    }, (res) => {
                        this.$message.error(`错误: ${res}`);
                    })
            },
            get_redeem_operation() {

                // Step 1
                this.$http.get('nonce/')
                    .then((res) => {
                        const postData1 = {
                            "nonce": res.data.nonce,
                            "address": window.LJWallet['address'],
                            "signature": ljSign(LJWallet['privateKey'], res.data.nonce)
                        };
                        // Step 2
                        this.$http.post('redeem/', postData1).then((res) => {
                            const postData2 = {
                                "transaction": res.data.transcation,
                                "signature": ljSign(window.LJWallet['privateKey'], res.data.transaction)
                            };
                            // Step 3
                            this.$http.post('signature/redeem/', postData2)
                                .then((res) => {
                                    this.$message.success(`操作成功, txid:${res.data.txid}`)
                                }, (err) => {
                                    this.$message.error(`操作失败, error:${err.data.error}`)
                                })
                        }, (err) => {
                            this.$message.error(`Error in Step two: ${err}`);
                        })
                    }, (err) => {
                        this.$message.error(`Error in Step one: ${err}`)
                    })
            }
        },
        mounted() {
            this.get_redeem_order();
        }
    }
</script>

<style>
    .redeem-text td {
        color: #009cfd;
    }
</style>