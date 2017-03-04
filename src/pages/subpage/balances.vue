<template>
    <div class="propertylist">
        <!-- UI: table -->
        <table class="table data-table table-bordred table-striped">
            <thead>
                <th>资产类型 </th>
                <th>总量</th>
                <th>冻结量</th>
                <th>可用量</th>
                <th class="tb-btn">
                </th>
            </thead>
            <tbody>
                <tr v-for="balance in balances">
                    <td>{{balance['name']}}</td>
                    <td>{{balance['total']}}</td>
                    <td>{{balance['frozen']}}</td>
                    <td>
                        {{balance['valid']}}
                    </td>
                    <td class="tb-btn">
                        <template v-if="balance['name']=='人民币'">
                            <!-- <span class="link-span" @click="openPay">充值</span> -->
                            <!-- <span class="link-span" @click="openFetch">提现</span> -->
                            <span class="link-span" @click="balanceTransfer(balance['asset'], balance['divisible'],balance['name'],balancec['valid'])">转账</span>
                        </template>
                        <template v-else>
                            <!-- <span class="link-span" @click="balanceTransaction(balance['asset'],balance['divisible'],balance['current_price'])"> 交易</span> -->
                            <span class="link-span" @click="balanceTransfer(balance['asset'],balance['divisible'],balance['name'],balance['valid'])"> 转账</span>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="row">
            <div class="col-xs-12">
                <ul class="pagination pagePath  pull-right">
                    <li class="active"><a href="/">退出钱包</a></li>
                    <!-- TODO: 每页展示7行信息（7行资产品类、7行挂单、7行成交记录等）。当用户的某菜单栏信息超过7行时，才出现这样的页面按钮。没有超过7行的，不用展示按钮（或只展示第一页）。 -->
                    <!-- <li><a href="#">2</a></li>
                    <li><a href="#">3</a></li> -->
                </ul>
            </div>
        </div>
        <!-- UI: components -->
        <!-- dialog -->
        <!-- 充值 -->
        <el-dialog v-model="dialogPay" class="tiny-dialog">
            <div v-if="rechangeState==0">
                <div class="row ">
                    <span class="col-xs-3" style="margin-top:8px">人民币充值:</span>
                    <div class="col-xs-6">
                        <input
                                type="text" class="form-control" placeholder="请输入充值金额"
                                v-model="rechangeValue" style="width:100%!important">
                    </div>
                    <div class="col-xs-3">
                        <span
                                v-if="rechangeValue =='' " class="error-text"
                        >充值额度</span>
                        <span
                                v-else-if=" isNaN(parseInt(rechangeValue)) || parseInt(rechangeValue)< 100"
                                class="error-text">额度错误</span>
                        <span v-else> <img src="/src/assets/yes.png"/> </span>
                    </div>
                </div>
                <div class="row" style="margin-top:10px;">
                    <div class="col-xs-3"></div>
                    <div class="col-xs-6">
                        <button
                            class="btn btn-block ljbutton"
                            @click="rechange">确认充值</button>
                    </div>
                </div>
                <div class="row  ">
                    <div class="col-xs-12 ">
                        <div class="dialog-shuoming">
                            <p>说明：</p>
                            <p>1.最低充值金额为100元。</p>
                            <p>2.目前只支持支付宝充值通道。</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="rechangeState == 1">
                <div class="row">
                    <div class="col-xs-10 col-xs-offset-1">
                        <p style="color:#717171">
                            1.本次充值金额为<span class="blue-span">{{ rechangeValue }}</span>元
                        </p>
                        <p style="color:#717171">
                            2.登录您的支付宝账户，选择“转账-转到支付宝账户” （建议使用手机支付宝账户转账）。
                        </p>
                        <p style="color:#717171">
                            3.将充值资金转至下方支付宝账户：支付宝账户：<span class="blue-span">xxxxxxxx@qq.com  </span>户名：蓝鲸兑网关
                        </p>
                        <p style="color:#717171">
                            4.在“添加备注”一栏，填写您的UID号（格式：<span class="blue-span">UID：XXXX</span>）
                        </p>
                        <p style="color:red">
                            5.转账时，请正确填写转账金额（需与充值金额一致）；仔细核对您的UID号码。否则将造成您的资金损失！
                        </p>
                        <div class="row">
                            <div class="col-xs-6 col-xs-offset-3">
                                <button class=" btn btn-block ljbutton" @click="rechangeState =2 ">
                                    已完成转账
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="rechangeState ==2">
                <div class="row text-center">
                    <span> <img src="/src/assets/yes.png"/>
                        </span>
                    <p style="margin-top:5px;"><b>充值成功！</b></p>
                </div>
                <div class="row" style="margin-top:10px;">
                    <div class="col-xs-6 col-xs-offset-3">
                        <p style="color:#717171">
                            充值金额将在30分钟内到达您的个人账户，否则请联系客服咨询！
                        </p>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 提现 -->
        <el-dialog v-model="dialogDisPay" class="tiny-dialog">
            <div v-if="fetchState == 0 ">
                <div class="row ">
                    <span class="col-xs-3" style="margin-top:8px">人民币提现:</span>
                    <div class="col-xs-6">
                        <input type="text" class="form-control" v-model="fetchValue" placeholder="请输入提现额度 " style="width:100%!important">
                    </div>
                    <div class="col-xs-3">
                        <span v-if="fetchValue==''" class="error-text">
                        提现金额
                    </span>
                        <span
                                v-else-if="isNaN(parseInt(fetchValue)) || parseInt(fetchValue) < 5 "
                                class="error-text"
                        > 额度错误 </span>
                        <span v-else> <img src="/src/assets/yes.png"/> </span>
                    </div>
                </div>
                <div class="row " style="margin-top:10px">
                    <span class="col-xs-3" style="margin-top:8px">支付宝账号:</span>
                    <div class="col-xs-6">
                        <input
                                type="text" class="form-control" placeholder="请输入您的支付宝账户地址"
                                v-model="alipay_account" style="width:100%!important">
                    </div>
                    <div class="col-xs-3">
                        <span
                                v-if="alipay_account==''"
                                class="error-text"
                        > 输入账号 </span>

                        <span
                                v-else-if="!(/^0?(13[0-9]|15[012356789]|18[0123456789]|14[0123456789]|17[0123456789])[0-9]{8}$/.test(alipay_account))
                            || alipay_account.length > 32 "
                                class="error-text"
                        > 账号错误 </span>
                        <span v-else> <img src="/src/assets/yes.png"/> </span>
                    </div>
                </div>
                <div class="row " style="margin-top:10px">
                    <span class="col-xs-3" style="margin-top:8px">账号名:</span>
                    <div class="col-xs-6">
                        <input
                                type="text" class="form-control" placeholder="请输入您的支付宝账户名"
                                v-model="alipay_account_name" style="width:100%!important">
                    </div>
                    <div class="col-xs-3">

                        <span
                                v-if="alipay_account_name==''"
                                class="error-text"
                        > 输入账号名 </span>

                        <span
                                v-else-if="alipay_account_name.length > 24 || alipay_account_name==''  "
                                class="error-text"
                        > 账号名错误 </span>
                        <span v-else> <img src="/src/assets/yes.png"/> </span>
                    </div>
                </div>
                <div class="row" style="margin-top:10px;">
                    <div class="col-xs-3"></div>
                    <div class="col-xs-6">
                        <button class=" btn btn-block ljbutton" @click="fetch">确认提现</button>
                    </div>
                </div>
                <div class="dialog-shuoming">
                    <p>说明：</p>
                    <p>
                        1.人民币提现费率<span class="blue-span">0.2%</span>,&nbsp;单笔最低提现费<span class="blue-span">5元</span>。
                    </p>
                    <p> 2.目前只支持支付宝提现通道。</p>
                    <p style="color:red"> 3.请仔细核对您的支付宝账户和账户名信息，以免造成财产损失！</p>
                    <p> 4.系统将优先扣除您的抵用券代币作为提现费。</p>
                </div>
            </div>
            <div v-else-if="fetchState == 1">
                <div class="row fetchState1">
                    <div class="col-xs-6 col-xs-offset-3">
                        <p> 本次提现的额度: <span class="blue-span"> {{confirmInfo.value}}</span></p>
                        <p> 本次提现的费用: <span class="blue-span"> {{confirmInfo.fee}}</span></p>
                        <p> 我的支付宝账号: <span class="blue-span"> {{confirmInfo.alipay_account_name}}</span></p>
                        <p> 我的支付宝账号名: <span class="blue-span">{{confirmInfo.alipay_account}}</span></p>
                        <p> 本次扣除提现抵用卷<span class="blue-span"> {{confirmInfo.fee_first_value}} 元</span> 人民币<span class="blue-span">
                             {{confirmInfo.fee_cash}}元
                         </span></p>
                        <p> 实到帐 <span class="blue-span">{{confirmInfo.receive_value}}元</span>。
                        </p>
                        <div style="margin-top:10px">
                            <button class="btn btn-block ljbutton" @click="confirmfn">我已确认信息</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="row text-center">
                    <span> <img src="/src/assets/yes.png"/>
                        </span>
                    <p style="margin-top:5px;"><b>提现成功！</b></p>
                </div>
                <div class="row" style="margin-top:10px;">
                    <div class="col-xs-6 col-xs-offset-3">
                        <p style="color:#717171">
                            提现金额将在30分钟内到达您的支付宝账户，否则请联系客服咨询！
                        </p>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 转账 -->
        <el-dialog v-model="dialogTransfer" class="tiny-dialog">
            <div style="padding-left:10px;padding-right:20px">
                <div class="row">
                    <div class="col-xs-6">
                        <b>资产类型:{{ transfer_name }}</b>
                    </div>
                    <div class="col-xs-6 text-right">
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
                    <div class="col-xs-3">
                        <span
                                v-if="isNaN(parseInt(transfer_num))"
                                class="error-text"
                        > 数量错误 </span>
                        <span
                                v-else-if="transfer_num ==''"
                                class="error-text"
                        > 数量不能为空 </span>
                        <span v-else> <img src="/src/assets/yes.png"/> </span>
                    </div>
                </div>
                <div class="row" style="margin-top:20px">
                    <span class="col-xs-3" style="margin-top:8px">转账地址:</span>
                    <div class="col-xs-6">
                        <input
                                type="text" class="form-control"
                                v-model="transfer_address_value" style="width:100%!important">
                    </div>
                    <div class="col-xs-3">
                        <span
                                v-if="transfer_address_value[0]!='a' && transfer_address_value[0]!='A' "
                                class="error-text"
                        > 地址格式错误 </span>
                        <span
                                v-else-if="transfer_address_value ==''"
                                class="error-text"
                        > 地址不能为空 </span>
                        <span
                                v-else-if="transfer_address_value.length!=34"
                                class="error-text"
                        > 地址必须是34位 </span>
                        <span v-else> <img src="/src/assets/yes.png"/> </span>
                    </div>
                </div>
                <div class="row" style="margin-top:20px;">
                    <div class="col-xs-3"></div>
                    <div class="col-xs-6">
                        <button class="btn btn-block ljbutton" @click="transfer">确认转账</button>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 交易 -->
        <el-dialog v-model="dialogTransaction" id="dialogTransaction">
            <div class="row">
                <div class="col-xs-2">小蚁币：</div>
                <div class="col-xs-3">可用: <span class="blue-span">2386.00</span></div>
                <div class="col-xs-3">冻结: <span class="blue-span">2386.00</span> </div>
                <div class="col-xs-3">最新成交价: <span class="blue-span">{{current_price}}</span></div>
            </div>
            <div class="row" style="margin-top:15px">
                <div class="col-xs-2">人民币：</div>
                <div class="col-xs-3">可用: <span class="blue-span">2386.00</span></div>
                <div class="col-xs-3">冻结: <span class="blue-span">2386.00</span> </div>
            </div>
            <hr/>
            <div class="row" style="margin-top:30px">
                <div class="col-xs-6">
                    <div class="row">
                        <div class="col-xs-3" style="line-height: 30px;">买入量：</div>
                        <div class="col-xs-6">
                            <input
                                    type="text" class="form-control" placeholder="输入数量"
                                    v-model.number="buyNumValue" style="width:100%!important"/>
                        </div>
                        <div class="col-xs-3" style="line-height: 30px;">
                            <span
                                    class="error-text"
                                    v-if=" buyNumValue =='' || isNaN(parseInt(buyNumValue))  "
                            >数量错误</span>
                            <span v-else> <img src="src/assets/yes.png"/> </span>
                        </div>
                    </div>
                    <div class="row" style="margin-top:10px">
                        <div class="col-xs-3" style="line-height: 30px;">买入价：</div>
                        <div class="col-xs-6">
                            <input
                                    type="text" class="form-control" placeholder="输入价格"
                                    v-model="buyPriceValue" style="width:100%!important"/>
                        </div>
                        <div class="col-xs-3" style="line-height: 30px;">
                            <span
                                    class="error-text"
                                    v-if=" buyPriceValue =='' || isNaN(parseInt(buyPriceValue))  "
                            >数量错误</span>
                            <span v-else> <img src="src/assets/yes.png"/> </span>
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
                            <span
                                    class="error-text"
                                    v-if=" sellNumValue =='' || isNaN(parseInt(sellNumValue))  "
                            >数量错误</span>
                            <span v-else> <img src="src/assets/yes.png"/> </span>
                        </div>
                    </div>
                    <div class="row" style="margin-top:10px">
                        <div class="col-xs-3" style="line-height: 30px;">卖出价：</div>
                        <div class="col-xs-6">
                            <input
                                    type="text" class="form-control"
                                    v-model="sellPriceValue" style="width:100%!important" placeholder="输入价格"/>
                        </div>
                        <div class="col-xs-3" style="line-height: 30px;">
                            <span
                                    class="error-text"
                                    v-if=" sellPriceValue =='' || isNaN(parseInt(sellPriceValue))"
                            >数量错误</span>
                            <span v-else> <img src="src/assets/yes.png"/> </span>
                        </div>
                    </div>
                    <div class="row" style="margin-top:10px">
                        <div class="col-xs-3" style="line-height: 30px;"></div>
                        <div class="col-xs-6">
                            <button class="btn btn-lj-gree btn-block" @click="sell">卖出</button>
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
                dialogPay: false,
                dialogDisPay: false,
                dialogTransfer: false,
                dialogTransaction: false,
                balances: [],
                // common
                valueassetid: "",
                assetId: "",
                divisible: false,
                // 列表
                current_price: "",
                transfer_name: "",
                transfer_valid: "",

                // 交易
                buyNumValue: "",
                buyPriceValue: "",
                sellNumValue: "",
                sellPriceValue: "",
                // 转账
                transfer_num: "",
                transfer_address_value: "",
                transfer_err: false,

                // 充值
                rechangeValue: "",
                rechangeState: 0,
                // 提现
                fetchValue: "",
                alipay_account_name: "",
                alipay_account: "",
                fetchState: 0,
                confirmInfo: {}
            }
        },
        methods: {
            getbalances: function() {

                this.$http.get('balances/' + window.LJWallet.address + '/').then((response) => {
                    this.balances = response.data.balances;
                    this.valueassetid = response.data.balances[0].asset;
                }, (response) => {
                });
            },

            openPay: function() {
                this.dialogPay = true;
                this.rechangeState = 0;
                this.rechangeValue = "";



            },
            openFetch: function() {
                this.dialogDisPay = true;
                this.fetchState = 0;
                this.fetchValue = "";
                this.alipay_account_name = "";
                alipay_account = "";

            },
            balanceTransaction: function(asset, divisible, current_price) {
                this.dialogTransaction = true;
                this.assetId = asset;
                this.divisible = divisible;
                this.current_price = current_price
            },



            transactionAJAX: function(num, price, type) {
                /*num:数量,price:价格,type:操作类型(false:买,true:卖)*/
                var self = this;

                var postData = {
                        assetid: self.assetId,
                        price: price,
                        amount: num,
                        client: window.LJWallet.publicKeyCompressed,
                        way: type,
                        valueassetid: self.valueassetid,
                        hex_pubkey: window.LJWallet.publicKey
                    }
                    // 交易步骤1:
                this.$http.post('order/', postData, {
                    emulateHTTP: true,
                    emulateJSON: true
                }).then((response) => {
                    var postData2 = {};
                    postData2.signature = ljSign(window.LJWallet['privateKey'], response.data.transaction);
                    postData2.id = response.data.order.id;
                    // 交易步骤2：
                    self.$http.get('nonce/').then((response) => {
                        postData2.nonce = response.data.nonce;
                        // 交易步骤3： (post->sign : 接口有问题 )
                        self.$http.post('sign/', postData2, {
                            emulateHTTP: true,
                            emulateJSON: true
                        }).then((response) => {
                            self.$message.success('转账成功！txid:' + response.body.txid);
                            self.dialogTransaction = false;
                        }, (response) => {
                            self.$message.error('交易失败！ :' + response.body.non_field_errors[0]);
                            self.dialogTransaction = false;
                        })
                    }, (response) => {
                        self.$message.error('交易失败！');
                        self.dialogTransaction = false;
                        throw response;
                    });

                }, (response) => {
                    self.$message.error('交易失败！');
                    self.dialogTransaction = false;
                    throw response;
                });


            },
            buy: function() {
                if (this.buyNumValue == '' || this.buyPriceValue == '') {
                    return;
                }
                /*资产是否可分割*/
                if (this.divisible) {
                    this.buyNumValue = Number(this.buyNumValue).toFixed(4);
                    this.buyPriceValue = Number(this.buyPriceValue).toFixed(4);
                } else {
                    this.buyNumValue = Math.floor(this.buyNumValue)
                    this.buyPriceValue = Math.floor(this.buyPriceValue)
                };
                this.transactionAJAX(this.buyNumValue, this.buyPriceValue, false);


            },
            sell: function() {

                if (this.sellNumValue == '' || this.sellPriceValue == '') {
                    return;
                }
                /*资产是否可分割*/
                if (this.divisible) {
                    this.sellNumValue = Number(this.sellNumValue).toFixed(4);
                    this.sellPriceValue = Number(this.sellPriceValue).toFixed(4);
                } else {
                    this.sellNumValue = Math.floor(this.sellNumValue)
                    this.sellPriceValue = Math.floor(this.sellPriceValue)
                };
                this.transactionAJAX(this.sellNumValue, this.sellPriceValue, true);


            },
            balanceTransfer: function(asset, divisible, name, valid) {
                this.assetId = asset;
                this.transfer_name = name;
                this.transfer_valid = valid;
                this.divisible = divisible;
                this.dialogTransfer = true;
            },
            transfer: function() {
                var self = this;
                var address_value = $.trim(self.transfer_address_value);
                if (self.transfer_num == "" || self.transfer_address_value == "") {
                    return;
                }
                // 转账地址校验
                if ((address_value[0] == 'a' || address_value[0] == 'A') && address_value.length == 34) {
                    postAjax(self);
                } else {
                    return;
                }

                function postAjax(self) {
                    self.transfer_address_err = false;
                    if (self.divisible) {
                        self.transfer_num = Number(self.transfer_num).toFixed(4);
                    } else {
                        self.transfer_num = Math.floor(self.transfer_num)
                    }

                    var postData = {
                            dest: self.transfer_address_value,
                            source: window.LJWallet.address,
                            amount: self.transfer_num,
                            compressed_pubkey: window.LJWallet.publicKeyCompressed,
                            assetid: self.assetId,
                            hex_pubkey: window.LJWallet.publicKey
                        }
                        /*转账步骤1*/
                    self.$http.post('balances/transfer/', postData, {
                        emulateHTTP: true,
                        emulateJSON: true
                    }).then((response) => {
                        /*转账步骤2*/
                        var postData = response.data;
                        postData.signature = ljSign(window.LJWallet.privateKey, postData.transaction);
                        delete postData.transaction;

                        // console.log('*转账步骤2*', postData)

                        self.$http.get('nonce/').then((response) => {
                            postData.nonce = response.data.nonce;
                            // console.log('*转账步骤3*', postData)

                            self.$http.post('sign/', postData, {
                                emulateHTTP: true,
                                emulateJSON: true
                            }).then((response) => {
                                self.$message.success('转账成功！txid:' + response.body.txid);
                                self.transfer_address_value = "";
                                self.transfer_num = "";
                                self.dialogTransfer = false;
                                this.getbalances();

                            }, (response) => {
                                self.$message.error('转账失败,请重试! txid:' + response.body.txid);
                                self.transfer_address_value = "";
                                self.transfer_num = "";
                                self.dialogTransfer = false;

                            });

                        }, (response) => {
                            self.$message.error('转账失败,请重试！');
                            self.transfer_address_value = "";
                            self.transfer_num = "";
                            self.dialogTransfer = false;
                            throw response;
                        })

                    }, (response) => {
                        self.$message.error('转账失败,请重试！');
                        self.transfer_address_value = "";
                        self.transfer_num = "";
                        self.dialogTransfer = false;
                        this.getbalances();
                        throw response;
                    });
                }

            },

            rechange: function() {

                // 充值
                var self = this;
                if (self.rechangeValue == '' || self.rechangeValue < 100) {
                    return;
                }
                self.$http.get('nonce/').then((response) => {

                    var postdata = {};
                    postdata.nonce = response.data.nonce;
                    var signature = ljSign(window.LJWallet.privateKey, response.data.nonce);
                    postdata.signature = signature;
                    postdata.value = self.rechangeValue;
                    postdata.hex_pubkey = window.LJWallet.publicKey;
                    postdata.address = window.LJWallet.address;

                    self.$http.post('recharge/', postdata, {
                        emulateHTTP: true,
                        emulateJSON: true
                    }).then((response) => {
                        self.rechangeState = 1;
                    }, (response) => {
                        self.$message.error('充值失败,请重试！' + response.data.non_field_errors);
                    });

                }, (response) => {

                    self.$message.error('充值失败,请重试！')
                })


            },
            fetch: function() {
                // 提现
                var self = this;
                if (self.fetchValue == "" || self.alipay_account_name == "" || self.alipay_account == "") {
                    return;
                }

                self.$http.get('nonce/').then((response) => {

                    var postdata = {};
                    postdata.nonce = response.data.nonce;
                    var signature = ljSign(window.LJWallet.privateKey, response.data.nonce);
                    postdata.signature = signature;
                    postdata.value = self.fetchValue;
                    postdata.hex_pubkey = window.LJWallet.publicKey;
                    postdata.address = window.LJWallet.address;
                    postdata.alipay_account_name = self.alipay_account_name;
                    postdata.alipay_account = self.alipay_account;


                    self.$http.post('withdraw/', postdata, {
                        emulateHTTP: true,
                        emulateJSON: true
                    }).then((response) => {
                        self.fetchState = 1;
                        self.confirmInfo = response.data;

                    }, (response) => {
                        self.$message.error('提现失败,请重试！' + response.data.non_field_errors);
                    });


                }, (response) => {

                    self.$message.error('提现失败,请重试！')
                })



            },

            confirmfn: function() {
                var self = this;
                var signature1 = ljSign(window.LJWallet.privateKey, this.confirmInfo.transaction);
                var posd = {};
                posd.no = this.confirmInfo.no;
                posd.signature = signature1;

                this.$http.post('signature/withdraw/', posd, {
                    emulateHTTP: true,
                    emulateJSON: true
                }).then((response) => {
                    self.fetchState = 2;
                }, (response) => {
                    self.$message.error('提现失败,请重试！' + response.data.non_field_errors);
                });
            },

            // Check out the transfer value when keyup
            checkOutKeyValue: function(transfer_num) {
                return isNaN(parseInt(transfer_num) )
            }


        },
        mounted: function() {
            this.getbalances();
            setInterval(this.getbalances, 1000 * 60 * 5)
        }

};
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
