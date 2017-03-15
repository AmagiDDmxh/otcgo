<template>
    <div class="propertylist">
        <!-- UI: table -->
        <table class="table data-table table-bordred table-striped">
            <thead>
                <th>资产类型</th> <th>总量</th> <th>冻结量</th> <th>可用量</th> <th class="tb-btn"></th>
            </thead>
            <tbody>
                <tr v-for="balance in balances">
                    <td>{{balance['name']}}</td>
                    <td>{{balance['total']}}</td>
                    <td>{{balance['frozen']}}</td>
                    <td>{{balance['valid']}}</td>
                    <td>
                        <span
                            class="link-span"
                            @click="balanceTransfer(
                                        balance['asset'], balance['divisible'],
                                        balance['name'], balance['valid']
                            )">转账</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- TODO: Paging -->
        <!-- <div class="row">
            <div class="col-xs-12">
                <ul class="pagination pagePath  pull-right">
                    <li class="active"><a href="#">1</a></li>
                    TODO: 每页展示7行信息（7行资产品类、7行挂单、7行成交记录等）。当用户的某菜单栏信息超过7行时，才出现这样的页面按钮。没有超过7行的，不用展示按钮（或只展示第一页）。
                    <li><a href="#">2</a></li>
                    <li><a href="#">3</a></li>
                </ul>
            </div>
        </div> -->

        <!-- Dialog: transfer,转账 -->
        <el-dialog v-model="dialogTransfer" class="tiny-dialog">
            <!-- 
            **** 转账数量 
            *   @v-model: transfer_num
            *   检测:
            *       1. 转账数量是否为空 -> 请输入转账数量
            *       2. 转账类型是否可分割, 不可超过可用值
            *          如果可分割, 小数点后不能超过8位.
            *          不可分割, 不能出现小数
            **** 
            -->

            <div style="padding-left:10px;padding-right:20px">
                <div class="row">
                    <div class="col-xs-4">
                        <b>资产类型:{{ transfer_name }}</b>
                    </div>
                    <div class="col-xs-4">
                        <b>可用数量:{{ transfer_valid }}</b>
                    </div>
                </div>
                <div class="row" style="margin-top:20px">
                    <span class="col-xs-3" style="margin-top:8px">转账数量:</span>
                    <div class="col-xs-6">
                        <input
                            type="text" class="form-control"
                            v-model="transfer_num" style="width:100%!important">
                    </div>
                    <div class="col-xs-3" style="padding-left: 0;">
                        <span
                            v-if="transfer_num ==''"
                            class="error-text"> 请输入转账数量 </span>

                        <span
                            v-else-if="checkOutKeyValue"
                            class="error-text"> 数量错误 </span>

                    <span v-else> <img src="/src/assets/yes.png"/> </span>
                    </div>
                </div>

                <!-- 
                **** 地址
                *   @v-model: transfer_address_value
                *   检测: 
                *       1. 地址是否为空  -> 请输入转账地址.
                *       2. 地址是否为`'a' or 'A'`开头 || 是否为`34位 alphanumeric` -> 地址格式错误.
                *       3. 地址.trim()是否为34位.
                ****       
                -->
                
                <div class="row" style="margin-top:20px">
                    <span class="col-xs-3" style="margin-top:8px">转账地址:</span>
                    <div class="col-xs-6">
                        <input
                                type="text" class="form-control"
                                v-model="transfer_address_value" style="width:100%!important">
                    </div>
                    <div class="col-xs-3" style="padding-left: 0;">
                        <span
                                v-if="transfer_address_value ==''"
                                class="error-text"
                        > 请输入转账地址 </span>

                        <span
                                v-else-if="transfer_address_value.trim()[0]!='a' && transfer_address_value.trim()[0]!='A' || !/[a-zA-Z0-9]{34}/.test(transfer_address_value)"
                                class="error-text"
                        > 地址格式错误 </span>

                        <span
                                v-else-if="transfer_address_value.trim().length!=34"
                                class="error-text"
                        > 地址必须是34位 </span>
                        <span v-else> <img src="/src/assets/yes.png"/> </span>
                    </div>
                </div>

                <!-- 确认转账按钮 -->
                <div class="row" style="margin-top:20px;">
                    <div class="col-xs-3"></div>
                    <div class="col-xs-6">
                        <el-button class="btn btn-block ljbutton" @click="transfer" :loading="loading">确认转账</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
            return {
                // dialog
                dialogTransfer: false,
                balances: [],

                // common
                valueassetid: "",
                assetId: "",
                divisible: false,

                // 列表
                current_price: "",
                transfer_name: "",
                transfer_valid: "",

                // 转账
                transfer_num: "",
                transfer_address_value: "",
                transfer_err: false,

                // 按钮 Button
                loading: false,
                errNum: 1
            }
    },

    computed: {
        checkOutKeyValue() {
            return Number(this.transfer_num) > Number(this.transfer_valid) ||
            (this.divisible ?
                !/^\d+(\.\d{1,8})?$/.test(this.transfer_num) :
                !/^\d+$/.test(this.transfer_num)
            )
        }
    },

    methods: {
        
        getbalances: function() {
            this.$http.get(`balances/${window.LJWallet.address}/`).then((response) => {
                this.balances = response.data.balances;
                this.valueassetid = response.data.balances[0].asset;
            }, (response) => {
            	if (this.errNum <= 2) {
		            this.$message.error('服务器有点过载, 请稍等一下!');
		            this.errNum++;
	            } else {
                    this.errNum = 1;
                }
            });
        },

        balanceTransfer: function(asset, divisible, name, valid) {
            this.transfer_num = '';
            this.transfer_address_value = '';
            this.assetId = asset;
            this.transfer_name = name;
            this.transfer_valid = valid;
            this.divisible = divisible;
            this.dialogTransfer = true;
            this.loading = false;
        },

        transfer: function() {
            var address_value = this.transfer_address_value.trim();
            if (this.transfer_num == "" ||
                this.transfer_address_value == "" ||
                this.checkOutKeyValue) {
                return;
            }

            if (!this.divisible && Number(this.transfer_num) % 1 !== 0) {
                return;
            }

            // 转账地址校验
            if (!(/[a-zA-Z0-9]{34}/.test(address_value))){
                this.$message.error("地址有误，请查看重试！");
                return;
            }

            if (this.divisible) {
                this.transfer_num = Number(this.transfer_num).toFixed(8);
            } else {
                this.transfer_num = Math.floor(this.transfer_num);
            }

            this.loading = true;
            /*转账步骤1*/
            this.$http.post('balances/transfer/', {
                dest: this.transfer_address_value,
                source: window.LJWallet.address,
                amount: this.transfer_num,
                compressed_pubkey: window.LJWallet.publicKeyCompressed,
                assetid: this.assetId,
                hex_pubkey: window.LJWallet.publicKey
            }, { emulateHTTP: true, emulateJSON: true})
                .then((response) => {
                    /*转账步骤2*/
                    var postData = response.data;
                    postData.signature = ljSign(window.LJWallet.privateKey, postData.transaction);
                    delete postData.transaction;

                    // console.log('*转账步骤2*', postData)

                    this.$http.get('nonce/').then((response) => {
                        postData.nonce = response.data.nonce;
                        // console.log('*转账步骤3*', postData)

                        this.$http.post('sign/', postData, {
                            emulateHTTP: true,
                            emulateJSON: true
                        }).then((response) => {
                            this.loading = false;
                            this.$message.success('转账请求已发起，等待确认');
                            this.transfer_address_value = "";
                            this.transfer_num = "";
                            this.dialogTransfer = false;
                            this.getbalances();

                        }, (response) => {
                            this.$message.error('转账失败, 请稍后再试!');
                            this.transfer_address_value = "";
                            this.transfer_num = "";
                            this.dialogTransfer = false;
                        })

                    }, (response) => {
                        this.$message.error('转账失败, 请稍后再试！');
                        this.transfer_address_value = "";
                        this.transfer_num = "";
                        this.dialogTransfer = false;
                        throw response;
                    })

                }, (response) => {
                    this.$message.error('转账失败, 请稍后再试！');
                    this.transfer_address_value = "";
                    this.transfer_num = "";
                    this.dialogTransfer = false;
                    this.getbalances();
                    throw response;
                });
        }
    },

    mounted() {
        this.getbalances();
        refreshBalance = setInterval(() => {this.getbalances()}, 1000 * 5);
    },

    destroyed() {
        clearInterval(refreshBalance);
    }
};

let refreshBalance;
</script>


<style lang="css">
.active a:hover {
    cursor: pointer;
}

.blue-span {
    color: #2c9;
}

.tiny-dialog>div {
    width: 544px;
}


/*data-table */

.data-table th {
    height: 41px;
    background: #eeeeee;
    border-top: #ccc 1px solid;
    border-bottom: #ccc 1px solid;
}

.tb-btn {
    width: 240px;
}

.data-table th,
.data-table td {
    text-align: center;
}

.data-table td {
    height: 60px;
    line-height: 60px !important;
    color: #8c8c8c;
}

.ljbutton {
    background: #2c9;
    color: #fff;
}

.ljbutton:hover {
    color: #fff!important;
}

.dialog-shuoming {
    width: 100%;
    border-top: 1px solid #ccc;
    margin-top: 30px;
}

.dialog-shuoming p {
    color: #999;
    margin-bottom: 0px;
    margin-top: 5px;
}

#dialogTransaction>div {
    width: 850px;
}


/*data-table*/

.table-striped>tbody>tr:nth-child(even) {
    background-color: #eeeeee;
}

.table-striped>tbody>tr:nth-child(odd) {
    background-color: #fff;
}


/*分页*/

.pagePath li a {
    border-radius: 0px!important;
    background-color: #eeeeee;
}

.pagePath .active a {
    background: #2c9 !important;
    border-color: #2c9 !important;
}

.fetchState1 p {
    margin-bottom: 5px;
    color: #868282;
}
</style>
