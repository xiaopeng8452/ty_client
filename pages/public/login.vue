<template>
	<view class="warp">
		<view class="logo-head">
			<u-image height="140rpx" class="logo-img" mode="aspectFit" src="/static/login/logo.png"></u-image>
			<text class="logo-text">瑞芝康健</text>
		</view>
		<view class="login-import">
			<view class="logo-item">
				<u-icon class="item-icon" size="50" name="account"></u-icon>
				<input class="item-input" v-model.trim="mobile" type="text" placeholder="请输入手机号码"
					placeholder-class="item-input-placeholder" maxlength="11" />
			</view>
			<view class="logo-item">
				<u-icon class="item-icon" size="50" name="lock-open"></u-icon>
				<input class="item-input" v-model.trim="authcode" type="number" placeholder="请输入验证码"
					placeholder-class="item-input-placeholder" maxlength="6" />
				<text class="item-input_code" @click="getCode">{{codeTips}}</text>
			</view>
			<view>
				<button class="login-btn" hover-class="login-btn-hover" :loading="loading" :disabled="loading"
					@click="login">登录</button>
			</view>
			<view class="login-operate">
				<view>忘记密码</view>
				<view>注册账号</view>
			</view>
			<view class="login-other-head">
				<view class="other_text">其他登录方式</view>
				<view class="other-login-box">
					<view v-for="(list,key) in providerList" :key="key" @click="tologin(list)">
						<view v-if="list.img" class="other-login-list">
							<view class="other-login-img">
								<u-image height="80rpx" mode="aspectFit" :src="list.img"></u-image>
							</view>
							<view class="other-login-text">
								{{list.name}}
							</view>
						</view>
					</view>
				</view>
			</view>                                  
			<view class="user-agree">
				<u-checkbox-group>
					<u-checkbox v-model="privacySwitch" class="text" label-size="28">请阅读并选择<text class="import">隐私政策</text>
					</u-checkbox>
				</u-checkbox-group>
			</view>
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				mobile: '15147755422',
				authcode: '123456',
				codeTips: '',
				providerList: [],
				privacySwitch: false
			}
		},
		onLoad() {
			uni.getProvider({
				service: 'oauth',
				success: (result) => {
					this.providerList = [
						{name: 'QQ登录', img: '/static/temp/share_qq.png', id: 'qq'},
						{name: '微信登录', img: '/static/temp/share_wechat.png', id: 'weixin'},
						{name: '微博登录', img: '/static/temp/share_web.png', id: 'sinaweibo'},
					]
					// this.providerList = result.provider.map((value) => {
					// 	let providerName = '';
					// 	let providerImg = '';
					// 	switch (value) {
					// 		case 'weixin':
					// 			providerName = '微信登录',
					// 				providerImg = '/static/temp/share_wechat.png'
					// 			break;
					// 		case 'qq':
					// 			providerName = 'QQ登录'
					// 			providerImg = '/static/temp/share_qq.png'
					// 			break;
					// 		case 'sinaweibo':
					// 			providerName = '微博登录'
					// 			providerImg = '/static/temp/share_web.png'
					// 			break;
					// 		case 'xiaomi':
					// 			providerName = '小米登录'
					// 			providerImg = ''
					// 			break;
					// 		case 'alipay':
					// 			providerName = '支付宝登录'
					// 			providerImg = ''
					// 			break;
					// 		case 'baidu':
					// 			providerName = '百度登录'
					// 			providerImg = ''
					// 			break;
					// 		case 'toutiao':
					// 			providerName = '头条登录'
					// 			providerImg = ''
					// 			break;
					// 		case 'apple':
					// 			providerName = '苹果登录'
					// 			providerImg = ''
					// 			break;
					// 	}
					// 	return {
					// 		name: providerName,
					// 		id: value,
					// 		img: providerImg
					// 	}
					// });
					console.log(this.providerList)
				},
				fail: (error) => {
					console.log('获取登录通道失败', error);
				}
			});
		},
		methods: {
			// 获取验证码
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码',
						mask: true
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 2000);
				} else {
					this.$u.toast('当前不可发送');
				}
			},
			codeChange(text) {
				this.codeTips = text;
			},
			// 登录
			login() {
				// 判断是否为手机号
				if (this.$u.test.mobile(this.mobile)) {
					// 判断验证码是否6位数字
					if (this.authcode.length == 6) {
						// 判断是否勾选隐私政策
						if(this.privacySwitch){
							uni.showLoading({
								title: '登录中...'
							})
							this.loading = true
							uniCloud.database().collection('uni-id-users').where({
								mobile: this.mobile,
								password: this.authcode
							}).field("username,nickname,gender,status,mobile,email,avatar,score").get().then((res) => {
								if (res.result.data.length && res.result.data[0].status === 0) {
									this.$u.vuex('hasLogin', true);
									this.$u.vuex('userInfo', res.result.data[0]);
									uni.setStorage({
										key: 'userInfo',
										data: res.result.data[0],
										success:(res)=> {
											console.log('success:' + res);
										}
									});
									// 获取到数据，登录
									setTimeout(() => {
										uni.switchTab({
											url: '/pages/tabbar/home'
										});
									}, 100)
								} else {
									this.$refs.uToast.show({
										title: '账号密码错误',
										type: 'error'
									})
								}
							}).catch((err) => {
								console.log(err)
								this.$refs.uToast.show({
									title: err.message,
									type: 'error'
								})
							}).finally(() => {
								uni.hideLoading()
								this.loading = false
							});
						}else{
							this.$refs.uToast.show({
								title: '请勾选隐私政策'
							})
						}
					} else {
						this.$refs.uToast.show({
							title: '请输入6位数字验证码'
						})
					}
				} else {
					this.$refs.uToast.show({
						title: '请输入正确手机号码'
					})
				}
			},
			// 快捷登录
			tologin(data){
				// data 
				console.log(data)
			}
		}
	}
</script>

<style lang="scss" scoped>
	$login-bj-color: #edf4fa;
	$login-color: #7ea3d4;

	.warp {
		height: 100vh;
		display: flex;
		align-items: center;
		flex-direction: column;
		background-color: $login-bj-color;
		background-image: linear-gradient(105deg, #edf4fa 70%, #d2d8dc 95%);

		.logo-head {
			display: flex;
			width: 100%;
			height: 34vh;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.logo-img {
				text-align: center;
			}

			.logo-text {
				font-size: 50upx;
				font-weight: bold;
				color: $login-color;
				margin-top: 20upx;
				letter-spacing: 10upx;
			}
		}

		.login-import {
			width: 76vw;

			.logo-item {
				position: relative;
				display: flex;
				padding: 8upx;
				border: 4upx solid #bdd8e9;
				margin-bottom: 50upx;
				border-radius: 40upx;
				align-items: center;

				.item-icon {
					width: 80upx;
					justify-content: center;
					color: #a4bfe1;
				}

				.item-input {
					height: 60upx;
					color: #777981;
					font-size: 30upx;

				}

				.item-input-placeholder {
					color: #acc5e4;
					font-size: 26upx;
					letter-spacing: 1px;
				}

				.item-input_code {
					position: absolute;
					color: $login-color;
					font-size: 24upx;
					right: 24upx;
					top: 20upx;
				}
			}

			.login-btn {
				color: #fff;
				font-size: 40upx;
				border-radius: 50upx;
				font-weight: bold;
				letter-spacing: 2px;
				height: 90upx;
				line-height: 90upx;
				background-color: #7cc1e0;
				background-image: linear-gradient(to bottom, #8acee0 10%, #7cc1e0 45%, #72b5cf 90%);
				box-shadow: 0 2rpx 10upx #737373;
				transition: all .6s;
				&:after {
					border: 1px solid rgba(164, 169, 168, 0.2);
				}

				&[disabled] {
					background-color: #6babc7;
					background-image: linear-gradient(to bottom, #9ecfdc 10%, #6babc7 45%, #8ab6c7 90%);
				}
			}

			.login-btn-hover {
				box-shadow: 0 0 5upx #a5a5a5;
			}

			.login-operate {
				display: flex;
				justify-content: space-between;
				margin-top: 50upx;
				color: $login-color;
			}

			.login-other-head {
				position: relative;
				height: 4upx;
				color: $login-color;
				margin-top: 70upx;
				padding-top: 50rpx;
				.other_text {
					position: absolute;
					background-color: $login-bj-color;
					padding: 0 20upx;
					left: calc(50% - 55px);
					top: -24upx;
				}

				.other-login-box {
					display: flex;
					justify-content: space-around;
					.other-login-list {
						flex: 1;
						.other-login-img {
							width: 100%;
							margin-bottom: 10upx;
						}

						.other-login-text {
							font-size: $uni-font-size-sm;
							color: #b5b5b5;
							text-align: center;
						}
					}
				}
				&::before{
					position: absolute;
					display: block;
					content: ' ';
					top: -6rpx;
					left: 0;
					right: 0;
					height: 3upx;
					background-color: #bdd8e9;
				}
			}

			.user-agree {
				position: fixed;
				left: 50%;
				bottom: 20rpx;
				transform: translate(-50%, -50%);

				.text {
					/deep/ .u-checkbox__label {
						color: #909399;
						.import {
							color: #ff3535;
							padding-left: 5upx;
						}
					}
				}
			}

		}
	}
</style>
