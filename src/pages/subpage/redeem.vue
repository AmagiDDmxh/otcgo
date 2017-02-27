<template>
    <div class="obligation">
        <button class="btn" style="float: right; margin: -60px 30px;" @click="get_redeem_operation()">一键取回</button>
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
    const baseURL = 'https://otcgo.cn/api/v1';
    export default {
        data() {
            return {
                listData: [],
                tempAccess: false
            }
        },
        methods: {
            get_redeem_order() {
                this.axios.get(`${baseURL}/redeem/${window.LJWallet['address']}/`)
                    .then(res => {
                        this.listData = res.data;
                    })
                    .catch(res => {
                        this.$message.error(`错误: ${res}`);
                        throw res;
                    })
            },
            get_redeem_operation() {
                const _this = this;
                // Step 1
                _this.axios.get(`${baseURL}/nonce/`)
                    .then(res => {
                        const postData1 = {
                            "nonce": res.data.nonce,
                            "address": LJWallet['address'],
                            "signature": ljSign(LJWallet['privateKey'], res.data.nonce)
                        };
                        // Step 2
                        _this.axios.post(`${baseURL}/redeem/`, postData1).then(res => {
                            const postData2 = {
                                "transaction": res.data.transcation,
                                "signature": ljSign(LJWallet['privateKey'], res.data.transaction)
                            };
                            // Step 3
                            _this.axios.post(`${baseURL}/signature/redeem/`, postData2)
                                .then(res => {
                                    _this.$message.success(`操作成功, txid:${res.data.txid}`)
                                }, err => {
                                    _this.$message.error(`操作失败, error:${err.data.error}`)
                                    console.log(`Step Three, post -> signature/redeem/: ${err}`)
                                })
                                .catch(err => console.log(err))
                        }).catch(err => {
                            console.log(`Step Two, get -> redeem/ :${err.data.error}`)
                        })

                    }).catch(err => {
                    _this.$message.error(`Error in Step one: ${err}`)
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