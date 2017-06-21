<template>
  <div class="container-padding">
    <div class="panel panel-default panel-state">
      <div class="panel-body">
        创建离线钱包
      </div>
    </div>
    <div class="row">
      <div class="col-xs-offset-3">
        <h3 class="h2">创建个人钱包账户</h3>
      </div>
    </div>
    <div class="login-body row">
      <!-- tiao -->
      <div class="col-xs-3 col-lg-3">
        <div class="ad-tips">
          <div class="ad-tips__title">注&nbsp;意&nbsp;事&nbsp;项</div>
          <div style="background-color:#f2f2f2;color:#aeaeae;padding:20px 15px">
            <h4 class="text-center" style="margin-bottom: 10px; color: #928f8c;">关于 钱包文件</h4>
            <p>钱包文件是您登录个人钱包的唯一凭证。损坏、遗失、被盗将会造成无法挽回的资产损失。请妥善保管</p>
            <h4 class="text-center" style="margin-bottom:10px; color: #928f8c; margin-top: 30px;">关于 登录密码</h4>
            <p>登录密码是您钱包资产的第二道安 全防线。请牢记登录密码，一旦遗忘，无法找回，造成资产损失。</p>
          </div>
        </div>
      </div>
      <div class="content col-xs-9 col-lg-9">
        <div>
          <div class="row" style="margin-top:55px;">
            <div class="col-xs-3">
            </div>
            <div class="col-xs-6">
              <div style="width: 400px;">
                <p><span class="blue-span"> {{ fileName }}</span>的钱包文件已生成在浏览器的下载路径， 请注意查收并妥善保管！</p>
                <p>
                  若钱包文件没有自动下载,请
                  <span class="link-span" @click="download">点此下载！</span>
                </p>
                <p>请认真阅读关于 <span class="blue-span">钱包文件,登录密码</span>的注意事项！</p>
              </div>
            </div>
          </div>
          <div class="row" style="margin-top:10px">
            <div class="col-xs-3 ">
            </div>
            <div class="col-xs-6">
              <el-button class="btn btn-lj form-control" @click="login"
                         style="border-radius: 6px; color: white;"
                         :loading="loading">
                  登录个人钱包
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-offset-3">
      <p class="tips">离线钱包由小蚁区块链提供技术支持</p>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      loading: false
    }),

    computed: mapGetters(['signUp', 'fileName'])
    ,
    methods: {
      login() {
        this.$store.commit('LOGIN')
        this.$store.commit('SIGN_UP')
        this.$router.push('/login')
      },

      download() {
        this.$store.commit('DOWNLOAD_WALLET')
      }
    },

    beforeRouteEnter(to, from, next) {
      next(vm => vm.signUp ? next() : next('/signUp'))
    },

    created() {
      this.$message.warning('请确保已下载钱包文件，防止钱包文件丢失。')
    }
  }
</script>
