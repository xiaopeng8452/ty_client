<template>
	<view class="warp">
		<view class="head">
			<view class="head-l">
				<u-image class="portrait" width="120rpx" height="120rpx" shape="circle"
					:src="userInfo.avatar || 'https://preview.qiantucdn.com/58pic/39/70/72/32Q58PICxZasUnNwucTGv_PIC2018.jpg!w1024_new_small'"
					@tap="previewAvatar">
				</u-image>
				<view>
					<view class="name">{{userInfo.nickname || '未知人员'}}</view>
					<view class="member">
						<u-icon class="icon" name="integral-fill" size="26"></u-icon>
						<text>VIP会员{{Math.round(userInfo.score/400) || ''}}</text>
					</view>
				</view>
			</view>
			<view class="head-r" @click="navTo('/pages/personal/home')">
				<u-icon class="u-m-r-10" name="man-add-fill" size="46"></u-icon>
				<view>个人主页</view>
			</view>
		</view>
		<view class="block">
			<u-row gutter="16" justify="center" align="center">
				<u-col class="block-col" span="4">
					<view class="title">上次消费</view>
					<view class="value">{{eyeSwitch?consumeAmount.last: '****'}}</view>
				</u-col>
				<u-col class="block-col" span="4">
					<view class="title">剩余金额</view>
					<view class="value">{{eyeSwitch?consumeAmount.residue: '****'}}</view>
				</u-col>
				<u-col class="block-col" span="4">
					<view class="title">消费历史</view>
					<view class="value">{{eyeSwitch?consumeAmount.history: '****'}}</view>
				</u-col>
			</u-row>
			<view class="eye-btn" @tap="$u.throttle(changeEye, 500)">
				<u-icon :name="eyeSwitch?'eye-off':'eye-fill'" size="40" color="#b9b9b9"></u-icon>
			</view>
		</view>
		<view class="section">
			<view class="section-head">
				<u-row gutter="16">
					<u-col span="4" @click="navTo('/pages/personal/wallet')">
						<view class="icon-box">
							<u-icon name="red-packet-fill" size="46"></u-icon>
						</view>
						<view class="u-text-center">我的钱包</view>
					</u-col>
					<u-col span="4" @click="navTo('/pages/personal/record/list')">
						<view class="icon-box">
							<u-icon name="red-packet-fill" size="46"></u-icon>
						</view>
						<view class="u-text-center">消费记录</view>
					</u-col>
					<u-col span="4">
						<view class="icon-box">
							<u-icon name="red-packet-fill" size="46"></u-icon>
						</view>
						<view class="u-text-center">免费赠品</view>
					</u-col>
				</u-row>
			</view>
			<u-cell-group>
				<u-cell-item :iconStyle="{'color':'#85d3c6'}" icon="integral-fill" title="会员等级" value="新版本">
				</u-cell-item>
				<u-cell-item :iconStyle="{'color':'#85d3c6'}" icon="list-dot" title="工具列表" value="5个" @tap="navTo()"></u-cell-item>
				<u-cell-item :iconStyle="{'color':'#85d3c6'}" icon="setting-fill" title="个人设置" @click="navTo('/pages/personal/set')"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 消费金额集合
				consumeAmount: {
					last: 389,
					residue: 9875,
					history: 37628
				},
				// 金额查看状态
				eyeSwitch: false
			}
		},
		onLoad() {

		},
		methods: {
			// 修改金额预览状态
			changeEye() {
				this.eyeSwitch = !this.eyeSwitch
			},
			// 路由跳转
			navTo(url) {
				// 针对未登录进行拦截
				if (this.hasLogin) {
					uni.navigateTo({
						url: url,
						success: (res) => {

						},
						fail: (errRes) => {

							uni.showToast({
								title: errRes.errMsg
							})
						}
					})
				} else {
					uni.navigateTo({
						url: '/pages/public/login'
					})
				}
			},
			// 预览图片
			previewAvatar() {
				console.log(this.userInfo.avatar)
				uni.previewImage({
					urls: [this.userInfo.avatar],
					longPressActions: {
						itemList: ['保存图片'],
						success: (data) => {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
							uni.saveImageToPhotosAlbum({
								filePath: this.userInfo.avatar,
								success: function() {
									console.log('save success');
								}
							});
						},
						fail: (err) => {
							console.log(err.errMsg);
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.warp {
		position: relative;
		background-color: $uni-bg-color;
		height: 100vh;

		.head {
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 400rpx;
			background-color: $uni-bg-color-main;
			margin-bottom: 80rpx;
			padding-bottom: 200rpx;
			color: #f5f5f5;

			.head-l {
				display: flex;
				align-items: center;

				.portrait {
					margin: 0 40rpx;
				}

				.name {
					font-size: $uni-font-size-lg;
					margin-bottom: 14rpx;
				}

				.member {
					display: inline;
					border-radius: 10rpx;
					background-color: #ff6f54;
					padding: 2rpx 15rpx 5rpx 8rpx;
					font-size: $uni-font-size-sm;

					.icon {
						margin-right: 7rpx;
					}
				}
			}

			.head-r {
				display: flex;
				color: $uni-text-color-main;
				background-color: $uni-bg-color;
				padding: 15rpx 30rpx 12rpx 35rpx;
				font-size: 30rpx;
				border-top-left-radius: 40rpx;
				border-bottom-left-radius: 40rpx;
			}
		}

		.block {
			position: absolute;
			top: 230rpx;
			width: 720rpx;
			padding: 20rpx 0;
			background-color: $uni-bg-color;
			margin: 0 15rpx;
			border-radius: 20rpx;
			box-shadow: 0 2rpx 18rpx $uni-border-color;

			.block-col {
				display: flex;
				flex-direction: column;
				margin: 30rpx auto;

				.title {
					color: $uni-text-color-grey;
					margin-bottom: 30rpx;
				}

				.value {
					font-size: 52rpx;
					font-weight: bold;
					color: #fe745a;
					text-shadow: 3rpx 3rpx 6rpx #795248;
					font-family: roman;
					height: 60rpx;
					line-height: 60rpx;
				}

				&+.block-col {
					border-left: 1px solid $uni-border-color;
				}
			}

			.eye-btn {
				display: flex;
				position: absolute;
				width: 80rpx;
				height: 60rpx;
				align-items: center;
				justify-content: center;
				right: 0;
				top: 0;
			}
		}

		.section {
			.section-head {
				color: #757575;

				.u-col {
					margin-top: 40rpx;
					margin-bottom: 40rpx;

					.icon-box {
						width: 75rpx;
						height: 75rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 0 auto;
						border-radius: 25rpx;
						margin-bottom: 20rpx;
						color: $uni-text-color-inverse;
						background-color: #000000;
					}

					&:first-child {
						.icon-box {
							background-image: linear-gradient(90deg, #ff9900, #fcc688);
						}
					}

					&:nth-of-type(2) {
						.icon-box {
							background-image: linear-gradient(90deg, #19be6b, #94e3b5);
						}
					}

					&:nth-of-type(3) {
						.icon-box {
							background-image: linear-gradient(90deg, #fa3534, #fab6b6);
						}
					}
				}
			}
		}
	}
</style>
