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
                this.getorders();
            }
        },
        methods: {
            getorders: function() {
                this.$http.get(`order/${window.LJWallet.address}/`).then((response) => {
                    this.listData = this.type == 'buy' ? response.data.bids : response.data.asks;
                }, (response) => {
                    console.log(response);
                })
            },
            cancel: function(id) {
                var self = this;
                var loading = self.$loading({
                    fullscreen: true
                });
                self.$http.get('nonce/').then((response) => {
                    var posdata1 = {};
                    posdata1.id = id;
                    posdata1.nonce = response.data.nonce;
                    var signature0 = ljSign(window.LJWallet.privateKey, response.data.nonce);
                    posdata1.signature = signature0;

                    self.$http.post('cancel/', posdata1, {
                        emulateHTTP: true,
                        emulateJSON: true
                    }).then((response) => {
                        // cancel succuss!
                        console.log('cancel succuss!')
                        var posdata2 = posdata1;
                        var signatrue1 = ljSign(window.LJWallet.privateKey, response.data.transaction);
                        posdata2.signature = signatrue1;
                        self.$http.post('sign/', posdata2, {
                            emulateHTTP: true,
                            emulateJSON: true
                        }).then((response) => {
                            console.log(response) /*撤单。。。。。。*/
                            self.$message.success('撤单成功');
                            loading.close();
                        }, (response) => {
                            console.log("sign", response);
                            loading.close();
                            self.$message.error('撤单失败,请重试');
                        });

                    }, (error) => {
                        console.log('cancel', error)
                        loading.close();
                        self.$message.error('撤单失败,请重试 : ' + error);
                    })

                }); //nonce

            }
        },
        mounted: function() {
            this.getorders();
        }
}
</script>
<style lang="css">
</style>
