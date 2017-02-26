<template>
	<div class="container container-padding">
		<div class="panel panel-default panel-state">
			<div class="panel-body">
				创建离线钱包
			</div>
		</div>
		<div class="login-body row">
			<!-- Left side Warning: -->
			<div class="col-xs-3 col-lg-3">
				<div class="ad-tips">
					<ol>
						<li>
							请输入不超过20个字符的账户名。（可包含中文、英文、下划线，但不能以下划线开头）
						</li>
						<li>
							请输入8～16位便于牢记的登陆密码。（字母、数字、特殊字符的组合）
						</li>
						<li>
							请重复输入登录密码。
						</li>
					</ol>
				</div>
			</div>
			<!-- Warning End -->

			<!-- SignUp account Interface: -->
			<div class="content col-xs-9 col-lg-9">
				<h3 class="h2">创建离线钱包</h3>
				<div class="creatWallet-body" style="width:100%">
					<div class="row" style="margin-top:35px">
						<!-- Account -->
						<div class="col-xs-3 ">
							<p class="text-right" style="line-height: 30px;"> 账户名: </p>
						</div>

						<div class="col-xs-4">
							<input v-model="username" class="form-control" name="username"/>
						</div>

						<div class="col-xs-3" style="padding-left:0px;">
							<span
									class="error-text"
									style="display:inline-block;margin-top:5px;"
									v-if="username.length >=20"
							> 用户名不能超过20位 </span>

							<span
									v-else-if="username==''"
									class="error-text"
									style="display:inline-block;margin-top:5px;"
							> 用户名不能为空</span>

							<span v-else>
								<img src="/src/assets/yes.png"/>
							</span>
						</div>
					</div>

					<!-- WIF: Hex Key -->
					<div class="row" style="margin-top:10px">
						<div class="col-xs-3 ">
							<p class="text-right" style="line-height: 30px;"> WIF私钥: </p>
						</div>
						<div class="col-xs-4">
							<input v-model="wif" class="form-control" name="username" placeholder="若您没有WIF私钥，此栏不用填"/>
						</div>

						<div class="col-xs-3" style="padding-left:0px;">
							<span
									class="error-text"
									style="display:inline-block;margin-top:5px;"
									v-show="falseWIFMessage"
							> 私钥验证错误请重试 </span>
						</div>
					</div>
					<!---->

					<div class="row" style="margin-top:10px">
						<div class="col-xs-3 ">
							<p class="text-right" style="line-height: 30px;">登录密码: </p>
						</div>
						<div class="col-xs-4">
							<input
									type="password"
									class="form-control"
									v-model="password1"
									name="password1"/>
						</div>
						<div class="col-xs-3" style="padding-left:0px;">
							<span
									class="error-text"
									style="display:inline-block;margin-top:5px;"
									v-if="password1.length < 8 && password1.length >0"> 密码不能小于8位 </span>
							<span
									v-else-if="password1==''"
									class="error-text"
									style="display:inline-block;margin-top:5px;"> 密码不能为空 </span>
							<span v-else> <img src="/src/assets/yes.png"/> </span>
						</div>
					</div>
					<div class="row" style="margin-top:10px">
						<div class="col-xs-3">
							<p class="text-right" style="line-height: 30px;"> 重复密码: </p>
						</div>
						<div class="col-xs-4">
							<input
									type="password" class="form-control"
									v-model="password2" name="password2"/>
							<p v-show="passwordError" class="error-text">
								{{ passwordError }}
							</p>
						</div>
						<div class="col-xs-3" style="padding-left:0px;">
							<span
									v-if="password2.length < 8 && password1.length > 0"
									class="error-text" style="display:inline-block;margin-top:5px;"> 密码不能小于8位 </span>
							<span
									v-else-if="password2 != password1"
									class="error-text"
									style="display:inline-block;margin-top:5px;"> 两次密码输入不一致 </span>
							<span
									v-else-if="password2==''"
									class="error-text"
									style="display:inline-block;margin-top:5px;"> 密码不能为空 </span>
							<span v-else> <img src="/src/assets/yes.png"/> </span>
						</div>
					</div>
					<div class="row" style="margin-top:10px">
						<div class="col-xs-3 ">
						</div>
						<div class="col-xs-6">
							<button type="button"
							        class="btn  btn-lj form-control"
							        style="border-radius: 6px;"
							        @click="creatWallet">
								下一步
							</button>
						</div>
					</div>
				</div>
				<p class="tips">
					离线钱包由小蚁区块链提供技术支持
				</p>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
                username: "",  // 用户名
                password1: "",  // 密码框 1
                password2: "",  // 密码框 2
                filename: "",  // 文件名
                passwordError: "",  //
                wif: "",  // 私钥
				falseWIFMessage   : false
			}
		},
		methods: {
			creatWallet: function () {
				if (this.password1 == '' || this.password2 == '') {
					return;
				}
				if (this.password1.length < 8 || this.password2.length < 8) {
					return;
				}

				// 生成公私钥对
				if (this.wif) {
					if (/[a-z0-9A-Z]{52}/.test(this.wif)) {
						var publicKey = ljWifkeyToPubkey(this.wif);
						var privateKey = ljWifkeyToHexkey(this.wif);
					} else {
                        this.falseWIFMessage = !this.falseWIFMessage;
						return;
					}
				} else {
					var keyp = genKeyPairHex();
					var publicKey = keyp['pubhex'];
					var privateKey = keyp['prvhex'];
				}
				// 对私钥进行加密
				var privateKeyEncrypted = encryptPrivateKey(privateKey, this.password2);

				// 生成压缩版公钥
				var publicKeyCompressed = getCompressedPubHex(publicKey);
				// console.log(publicKeyCompressed);

				// 获取钱包地址
				this.$http.get('conversion/' + publicKeyCompressed)
					.then((response) => {
						// 生成钱包文件
						var json = {};
						var filename = this.username + '.json';

						json.address = response.data.address;
						json.publicKeyCompressed = publicKeyCompressed;
						json.publicKey = publicKey;
						json.privateKeyEncrypted = privateKeyEncrypted;
						// console.log(JSON.stringify(json))
						window.file = json;
						download(JSON.stringify(json), filename, 'text/plain');
						this.filename = filename;
						this.$router.push({
							path : 'wallet',
							query: {
								filename: filename
							}
						})
					}, (response) => {
						this.$message.error('创建钱包失败，请重试');
				});
			}
		}
	}

	function genKeyPairHex() {

		var ec = new KJUR.crypto.ECDSA({
			'curve': 'secp256r1'
		});
		var keypair = ec.generateKeyPairHex();
		var pubhex = keypair.ecpubhex;
		var prvhex = keypair.ecprvhex;
		return {
			'pubhex': pubhex,
			'prvhex': prvhex
		};
	}

	function encryptPrivateKey(prvkey, pwd) {

		var enckey = CryptoJS.AES.encrypt(prvkey, pwd);
		return enckey.toString();
	}

	function getCompressedPubHex(pubhex) {
		var ec = new KJUR.crypto.ECDSA({
			'curve': 'secp256r1',
			'pub'  : pubhex
		});
		var result = ec.getPublicKeyXYHex();
		var y = result['y'];
		var prefix = parseInt('0x' + y[y.length - 1]) % 2 ? '03' : '02';
		return prefix + result['x'];
	}


	function download(text, name, type) {
		var file = new Blob([text], {
			type: type
		})
		var aLink = document.createElement('a');
		aLink.href = URL.createObjectURL(file)
		aLink.download = name;
		aLink.click()
	}
</script>
<style lang="css">
	.btn-lj {
		background-color: #009cff;
		color: #fff;
	}

	.btn-lj:hover {
		background-color: #0585d6 !important;
		color: #fff;
	}
</style>
