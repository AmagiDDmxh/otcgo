<template>
    <div>
        <hr class="user-line" />
        <div class="user-info">
            <p><b>你的钱包地址是：</b>{{ address }}</p>
            <p><b>你的UID地址:</b>{{ UID }}</p>
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
