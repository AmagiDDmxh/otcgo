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
                <tr v-for="item in listData">
                    <td>{{item.name}}</td>
                    <td>{{item.amount}}</td>
                    <td>{{item.price}}</td>
                    <td>
                        {{item.price*item.amount}}
                    </td>
                    <td style="width:260px">
                        <button
                                class="btn ljbutton"
                                style="margin:0 auto"
                                v-if="item.status==0"
                                @click="cancel(item.id)"> 撤单
                        </button>
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
                listData: [],
                type: this.$route.query.type
            }
        },
        watch: {
            '$route' (to, from) {
                this.type = this.$route.query.type;
                this.getOrders();
            }
        },
        methods: {
            getOrders: function() {
                this.$http.get(`order/${window.LJWallet.address}/`).then((response) => {
                    this.listData = this.type === 'buy' ? response.data.bids : response.data.asks;
                }, (response) => {
                    console.log(response);
                })
            },
            cancel: function(id) {
                let loading = this.$loading({
                    fullscreen: true
                });
                this.$http.get('nonce/').then((response) => {
                    let posdata1 = {};
                    posdata1.id = id;
                    posdata1.nonce = response.data.nonce;
                    let signature0 = ljSign(window.LJWallet.privateKey, response.data.nonce);
                    posdata1.signature = signature0;

                    this.$http.post('cancel/', posdata1, {
                        emulateHTTP: true,
                        emulateJSON: true
                    }).then((response) => {
                        // cancel succuss!
                        console.log('cancel succuss!')
                        let posdata2 = posdata1;
                        let signatrue1 = ljSign(window.LJWallet.privateKey, response.data.transaction);
                        posdata2.signature = signatrue1;
                        this.$http.post('sign/', posdata2, {
                            emulateHTTP: true,
                            emulateJSON: true
                        }).then((response) => {
                            console.log(response) /*撤单。。。。。。*/
                            this.$message.success('撤单成功');
                            loading.close();
                        }, (response) => {
                            console.log("sign", response);
                            loading.close();
                            this.$message.error('撤单失败,请重试');
                        });

                    }, (error) => {
                        console.log('cancel', error)
                        loading.close();
                        this.$message.error('撤单失败,请重试 : ' + error);
                    })

                }); //nonce

            }
        },
        mounted: function() {
            this.getOrders();
        }
}
</script>
<style lang="css">
</style>
