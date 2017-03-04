<template>
    <div>
        <hr class="user-line" />
        <div class="user-info">
            <p><b>你的钱包地址是：</b>{{ address }}</p>
            <p><b>你的UID地址: </b>{{ UID }}</p>
        </div>
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
    </div>
</template>
<script>
export default {

    data() {
            return {
                address: window.LJWallet.address,
                UID: window.LJWallet.UID
            }
        },

    mounted: function () {
        this.$http.get('uid/' + window.LJWallet.address + '/').then((response) => {
            window.LJWallet.UID = response.data.uid;
            this.UID = response.data.uid;
        })
    }

}
</script>
<style lang="css">
.user-line {
    margin: 0px;
}

.user-info {
    margin-top: 66px;
}
</style>
