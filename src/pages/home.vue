<template>
    <div class="page-index">
        <div class="index ">
            <div class="row">
                <div class="col-xs-12 col-lg-12">
                    <div id="myCarousel" class="carousel slide" data-ride="carousel" data-interval="5000">
                        <!-- 轮播（Carousel）指标 -->
                        <ol class="carousel-indicators">
                            <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                            <li data-target="#myCarousel" data-slide-to="1"></li>
                            <li data-target="#myCarousel" data-slide-to="2"></li>
                        </ol>
                        <!-- 轮播（Carousel）项目 -->
                        <div class="carousel-inner">
                            <img class="item active" src="../assets/banner_1.png" alt="蓝鲸淘">
                            <img class="item " src="../assets/slide2.png" alt="蓝鲸淘">
                            <img class="item " src="../assets/slide3.png" alt="蓝鲸淘">
                        </div>
                        <!-- 轮播（Carousel）导航 -->
                        <a class="carousel-control left" href="#myCarousel" data-slide="prev">
                            <img style="margin-top:-10px;width:52px;" src="../assets/banner-left.png" alt="" />
                        </a>
                        <a class="carousel-control right" href="#myCarousel" data-slide="next">
                            <img style="margin-top:-10px;width:52px;" src="../assets/banner-right.png" alt="" />
                        </a>
                    </div>
                </div>
            </div>
            <div class="row content-1">
                <p></p>
                <div class="col-xs-6 col-lg-6">
                    <a href="###">
                        <span></span>
                        <img src="../assets/images/content_03.png" alt="">
                    </a>
                </div>
                <div class="col-xs-6 col-lg-6">
                    <router-link class="text-center" :to="{ path: '/markets', query: { 'class': 'anscny' }}">
                        <span></span>
                        <img src="../assets/images/content_05.png" alt="">
                    </router-link>
                </div>
            </div>
            <div class="row content-2">
                <p></p>
                <div class="col-xs-6 col-lg-6">
                    <router-link class="text-center" :to="{ path: '/markets', query: { 'class': 'anccny' }}">
                        <span></span>
                        <img src="../assets/images/content_09.png" alt=""></router-link>
                </div>
                <div class="col-xs-6 col-lg-6">
                    <a href="###">
                        <span></span>
                        <img src="../assets/images/content_11.png" alt=""></a>
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
        methods: {

        }
}
</script>
<style lang="css">
.carousel-control {
    background: #8e8e8e;
    height: 100px;
    line-height: 100px;
    font-size: 50px!important;
    width: 51px!important;
    margin-top: 140px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0);
    background-image: none;
}

.carousel-inner img {
    width: 100%;
    height: 400px;
}

.content-1 img {
    width: 100%;
    height: 100%;
}

.content-1 p {
    height: 45px;
    margin: 30px 15px 10px 15px;
    background: url('../assets/contetn-header-1.png') no-repeat;
    border-bottom: 1px solid #666;
}

.content-1 a {
    display: block;
    height: 100%;
    width: 100%;
    position: relative;
}

.content-1 a:hover span {
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
    cursor: pointer;
}

.page-index {
    height: 1100px;
}

.content-2 p {
    height: 45px;
    margin: 30px 15px 10px 15px;
    background: url('../assets/contetn-header-2.png') no-repeat;
    border-bottom: 1px solid #666;
}

.content-2 img {
    width: 100%;
    height: 100%;
}

.content-2 a {
    display: block;
    height: 100%;
    width: 100%;
    position: relative;
}

.content-2 a:hover span {
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
    cursor: pointer;
}
</style>
