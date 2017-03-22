<template>
<div>
    <div class="background">
        <div class="sign">
            <div class="group">
                <h2 style="color: hsl(0, 75%, 60%); margin: auto;">测试网</h2>
                <div class="betalogo"> 
                    <img class="betalogo__img" src="../assets/logo.png" alt="logo">
                </div>

                <router-link class="sign__link" to="/createWallet"> 创建钱包 </router-link>
                <router-link class="sign__link" to="/login"> 登录钱包 </router-link>
            </div>
        </div>
    </div>
</div>
</template>

<script>

    export default {
        data() {
            return {

            }
        },

    }

</script>

<style scoped>
    .group {
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flex;
        display: -o-flex;
        display: flex;
        
        -webkit-flex-direction: column;
        -moz-flex-direction: column;
        -ms-flex-direction: column;
        -o-flex-direction: column;
        flex-direction: column;
    }

    .betalogo {
        background: #fff;
        margin: 20px 0;
        height: 80px;
        display: flex;
        border-radius: 5px;
        align-items: center;
        justify-content: center;
    }
    
    .betalogo__img {
        margin: 0 auto;
    }

    .sign {
        min-width: 320px;
    }
    
    .sign__link {
        display: block;
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
        background: url('../assets/background.png');
        height: 100vh;
        -webkit-background-size: cover;
        background-size: cover;
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flex;
        display: -o-flex;
        display: flex;
        -webkit-flex-direction: column;
        -moz-flex-direction: column;
        -ms-flex-direction: column;
        -o-flex-direction: column;
        flex-direction: column;
        justify-content: center;
        -ms-align-items: center;
        align-items: center;
    }

</style>