<template>
	<view class="warp">
		<view class="card u-m-b-20">
			<view class="head">
				<view class="left u-m-r-20">
					<u-image width="140rpx" height="140rpx" border-radius="20" mode="scaleToFill" :src="src"></u-image>
				</view>
				<view class="right">
					<view class="block">
						<text class="name u-m-r-10">{{serverInfo.name || '-'}}</text>
						<text v-if="serverInfo._id">{{serverInfo.level[0]}}</text>
					</view>
					<view class="block">
						<text class="stores u-m-r-10">{{serverInfo.area || '-'}}</text>
						<text v-if="serverInfo._id">{{serverInfo.type[0]}}</text>
					</view>
					<view class="block">
						<text>擅长：</text>
						<text>{{serverInfo.describe || '-'}}</text>
					</view>
				</view>
			</view>
			<view class="foot">
				<view>
					<view class="tit">服务次数</view>
					<view class="val">
						<u-count-to fontSize="32" color="#fff" :start-val="0" :end-val="serverInfo.times || 0"></u-count-to>
					</view>
				</view>
				<view>
					<view class="tit">好评率</view>
					<view class="val">
						<u-count-to fontSize="32" color="#fff" :start-val="0" :end-val="serverInfo.rate * 100 || 0"></u-count-to>
						<text>%</text>
					</view>
				</view>
				<view>
					<view class="tit">服务年数</view>
					<view class="val">
						<u-count-to fontSize="32" color="#fff" :start-val="0" :end-val="serverInfo.dates || 0"></u-count-to>
						<text>年</text>
					</view>
				</view>
			</view>
		</view>
		<view class="section">
			<view class="u-item-title">费用明细</view>
			<view class="costs">
				<unicloud-db ref="udb" @load="handleLoad" v-slot:default="{data, loading, pagination, error, options}"
					collection="expense-calendar,opendb-mall-goods" :where="{'user_id': '12'}">
					<view class="lists u-skeleton" :scroll-y="true" @scrolltolower="scrollBottom">
						<view v-if="!loading">
							<view class="cost" v-for="(cost,index) in costs" :key="index">
								<view class="cost_l">
									<view class="cost_l_l">
										<u-image width="80rpx" height="80rpx" :src="cost.icon" shape="circle"></u-image>
									</view>
									<view class="cost_l_r">
										<view class="u-m-b-8">
											<text class="name">{{cost.name}}</text>
											<text class="price">￥{{cost.price}}</text>
										</view>
										<view class="describe">{{cost.goods_desc}}</view>
									</view>
								</view>
								<view class="cost_r">
									<u-icon name="arrow-right" size="36" color="#a7a7a7"></u-icon>
								</view>
							</view>
						</view>
						<view v-else>
							<view class="cost u-skeleton-rect" v-for="(item,index) in 2" :key="index"></view>
						</view>
					</view>
					<!--引用组件-->
					<u-skeleton :loading="loading" :animation="true" elColor="#eaeaea" bgColor="#fff"></u-skeleton>
				</unicloud-db>
			</view>
		</view>
		<view class="footer">
			<u-button type="warning" :ripple="true" ripple-bg-color="rgba(255,255,255,.3)"
				@click="navTo('/pages/personal/record/detail')">客户签名查看</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: 'https://preview.qiantucdn.com/58pic/36/30/79/87b58PIC1K30f9gb37aYr_PIC2018.jpg!w1024_new_0',
				serverInfo:{},
				costs: []
			}
		},
		 onLoad(options) {
			let spId = options.spId || 0;
			let goodId = options.goodId || '';
			this.costs = JSON.parse(decodeURIComponent(goodId))
			this.getServerInfo(spId);
		},
		methods: {
			handleLoad(data, ended) {
				this.loadMoreStatus = ended ? 'nomore' : 'loadmore';
			},
			// 获取服务人员基本信息
			async getServerInfo(spId){
				const db = uniCloud.database();
				let res = await db.collection('service-personnel').where({
				  sp_id: spId
				}).get()
				this.serverInfo = res.result.data[0] || {};
				
			},
			// 路由跳转
			navTo(url) {
				uni.navigateTo({
					url: url,
					success: (res) => {
						console.log('跳转消费记录签字-成功')
					},
					fail: (errRes) => {
						uni.showToast({
							title: errRes.errMsg
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.warp {
		background-color: $uni-bg-color-grey;
		height: 100vh;

		.card {
			background-color: $uni-bg-color-main;
			opacity: .9;
			height: 390rpx;
			padding: 20rpx;
			color: $uni-text-color-inverse;

			.head {
				display: flex;
				margin-bottom: 25rpx;

				.left {
					width: 210rpx;
				}

				.right {
					height: 210rpx;
					.block {
						margin-bottom: 10rpx;

						&:nth-of-type(1) {
							.name {
								font-size: $uni-font-size-lg;
								font-family: misansBold;
							}
						}

						&:nth-of-type(2) {
							text {
								font-family: misansNormal;
							}
						}

						&:nth-of-type(3) {
							font-size: $uni-font-size-sm;
							margin-bottom: 0;
							text-align: justify;

							text {
								font-family: misansNormal;
							}
						}
					}
				}
			}

			.foot {
				margin: 0 auto;
				padding: 14rpx 0;
				border-radius: $uni-border-radius-xl;
				background-color: rgba(255, 255, 255, .3);
				display: flex;
				justify-content: space-around;
				>view{
					flex: 1;
					text-align: center;
				}
				.tit {
					font-family: misansNormal;
					font-size: $uni-font-size-sm;
					margin-bottom: 10rpx;
				}

				.val {
					font-size: $uni-font-size-lg;
				}
			}
		}

		.section {
			width: calc(100vw - 40rpx);
			margin: 0 auto;
			background-color: $uni-bg-color;
			padding: 20rpx;
			border-radius: $uni-border-radius-base;

			.u-item-title {
				font-size: 34rpx;
				color: $uni-text-color-main;

				&::after {
					top: 2rpx;
					background-color: $uni-text-color-main;
				}
			}

			.costs {
				.cost {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 109rpx;
					padding: 15rpx 0;
					border-bottom: 1rpx solid $border-color-light;
					margin-bottom: 20rpx;
					&:last-child {
						border-bottom-width: 0;
						margin-bottom: 0;
					}

					.cost_l {
						display: flex;
						align-items: center;

						.cost_l_l {
							margin-right: 20rpx;
						}

						.cost_l_r {
							.name {
								margin-right: 20rpx;
								font-family: misansBold;
							}

							.price {
								font-family: misansNormal;
								color: $uni-text-color-main;
							}

							.describe {
								width: 520rpx;
								font-family: misansLight;
								color: $uni-text-color-grey;
								font-size: $uni-font-size-sm;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
						}
					}

					.cost_r {}
				}
			}
		}

		.footer {
			width: calc(100vw - 40rpx);
			position: fixed;
			bottom: 20rpx;
			left: 20rpx;
		}
	}
</style>
