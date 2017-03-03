<template>
    <div id="head">
        <div class="background">
            <img class="background__image" src="../assets/background.png" alt="background">
        </div>
        <div class="sign">
            <div class="betalogo">
                <router-link to="/">
                    <img class="betalogo__img" src="../assets/logo.png" alt="logo">
                </router-link>
            </div>
            <router-link class="sign__link" to="/creatWallet">
                创建钱包
            </router-link>
            <router-link class="sign__link" to="/login">
                登录钱包
            </router-link>
        </div>
        <p class="tips tips--cover">离线钱包由小蚁区块链提供技术支持</p>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                nothing: ''
            }
        }
    }

</script>

<style>
    #head {
        position: relative;
    }

    .betalogo {
        background: #fff;
        margin: 20px 0;
        width: 60%;
        height: 80px;
        display: block;
        border-radius: 5px;
    }

    .betalogo__img {
        margin: 17px 97px;
    }

    .tips--cover {
        border-top: 1px solid #22cc99;
        padding-top: 10px;
        color: #fff;
        position: absolute;
        left: 20%;
        width: 80%;
    }

    .sign {
        position: absolute;
        left: 40%;
        top: 30%;
        width: 540px;
    }

    .sign__link {
        display: block;
        width: 60%;
        height: 40px;
        text-align: center;
        line-height: 38px;
        font-size: 16px;
        color: #fff;
        border: 1px solid #fff;
        border-radius: 4px;
        letter-spacing: 2px;
        margin-bottom: 20px;
        font-weight: 400;
    }

    .sign__link:hover {
        color: #22cc99;
        background: #fff;
        text-decoration: none;
    }

    .background {
        position: relative;
    }

    .background-image {

    }
</style>