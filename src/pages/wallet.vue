<template>
<div style="margin: 100px 0;">
	<div class="container container-padding">
		<div class="panel panel-default panel-state">
			<div class="panel-body">
				创建离线钱包
			</div>
		</div>
		<div class="row">
			<div class="col-md-9 col-md-offset-3 col-xs-12">
				<h3 class="title-tip">创建个人钱包账户</h3>
			</div>
		</div>
		<div class="login-body row">
			<div class="col-xs-12 col-sm-3 col-lg-3">
				<div class="ad-tips">
					<div class="ad-tips">
						<div class="tips-title">注&nbsp;意&nbsp;事&nbsp;项</div>
						<div style="background-color:#f2f2f2;color:#aeaeae;padding:20px 15px">
							<p style="margin-bottom: 10px; color: #928f8c;">关于 钱包文件</p>
							<p>
								钱包文件是您登录个人钱包的唯一凭证。损坏、遗失、被盗将会造成无法挽回的资产损失。请妥善保管
							</p>
							<p style="margin-bottom:10px; color: #928f8c;">关于 登录密码</p>
							<p>
								登录密码是您钱包资产的第二道安 全防线。请牢记登录密码，一旦遗忘，无法找回，造成资产损失。
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="content col-xs-12 col-sm-9 col-lg-9">

				<div class="col-xs-12 col-md-6 col-md-offset-3" style="margin-top: 55px;">
					<p style="margin-bottom:15px;"> 若钱包文件没有自动下载,请 <span class="link-span" @click="downloadfile">点此下载！</span> </p>

          <p style="margin-bottom:15px;"> 请认真阅读关于 <span class="blue-span">钱包文件,登录密码</span>的注意事项！</p>

          <p style="margin-bottom:15px">
            <span class="blue-span"> {{ $route.query.filename }}</span> 的钱包文件已生成在浏览器的下载路径， 请注意查收并妥善保管！
					</p>
				</div>

				<div class="row" style="margin-top:10px">
					<div class="col-xs-12 col-sm-9 col-md-6 col-md-offset-3">
						<router-link class="btn btn-lj form-control" to="/login" style="color:#fff;text-decoration:none; border-radius: 6px;">登录个人钱包</router-link>
					</div>
				</div>
				</div>
		</div>
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-sm-offset-3">
        <p class="tips"> 离线钱包由小蚁区块链提供技术支持 </p>
      </div>
		</div>

		</div>
	</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				filename: this.$route.query.filename
			}
		},
		methods: {
			downloadfile: function () {
				download(JSON.stringify(window.file), this.filename, 'text/plain')
			}
		}

	}

	function download(text, name, type) {
		var file = new Blob([text], {
			type: type
		});
		var aLink = document.createElement('a');
		aLink.href = URL.createObjectURL(file);
    aLink.download = name;
		aLink.click();
	}
</script>
<style lang="css">

.tips-title {
	color: #fff;
	background: #2c9;
	padding: 10px 15px;
	display: block;
	text-align: center;
}

</style>
