<template>
    <div>
        <table class="table history-table table-bordred table-striped table-responsive" style="table-layout: fixed;">
            <thead>
            <tr>
                <th style="width:40%;vertical-align: middle;text-align: center;">对方地址</th>
                <th>资产类型</th>
                <th>资产数量</th>
                <th>转账时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="history in histories">
                <td class="col-md-6" style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;vertical-align: middle;text-align: center;">
                    <a class="link-interact"
                       :href="`//testnet.antchain.xyz/tx/hash/${history['txid']}`"
                       target="_blank">{{history['dest']}}</a>
                </td>
                <td class="col-md-2" style="vertical-align: middle;">{{history['name']}}</td>
                <td class="col-md-2" style="vertical-align: middle;">{{history['amount']}}</td>
                <td :title="history['time']" class="col-md-2">{{history['time']}}</td>
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
				histories: []
			}
		},

		methods: {
			getHistorys() {
				this.$http.get(`balances/transfer/history/${window.LJWallet.address}/`)
                    .then(res => {
                        this.histories = res.data.data;
                    }, errorRes => {
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
    .link-interact {
        color: #2c9;
    }

    .link-interact:hover {
        color: #229977;
        text-decoration: underline;
    }

    .boot-select {
        float: left;
        margin: 20px 0;
    }

    .history-table th {
        height: 41px;
        background: #eeeeee;
        border-top: #ccc 1px solid;
        border-bottom: #ccc 1px solid;
    }

    .history-table th,
    .history-table td {
        text-align: center;
    }

    .history-table td {
        height: 40px;
        color: #8c8c8c;
    }
</style>