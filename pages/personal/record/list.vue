<template>
	<view class="warp">
		<unicloud-db ref="udb" @load="handleLoad" v-slot:default="{data, loading, pagination, error, options}"
			collection="expense-calendar,opendb-mall-goods" :where="{'user_id':userId}">
			<!--  where="goods_id.user_id == userId" -->
			<scroll-view class="lists u-skeleton" :scroll-y="true" @scrolltolower="scrollBottom">
				<view v-if="!loading">
					<view class="list animation" v-for="(item,index) in data" :style="{transitionDelay:index*.1 + 's'}"
						:key="index" @click="navTo(item.sp_id,item.goods_id)">
						<view class="block">
							<text class="tit">项目名称：</text>
							<text class="val">{{item.goods_id[0].name}}</text>
						</view>
						<view class="block">
							<text class="tit">服务时间：</text>
							<text class="val">{{item.create_date}}</text>
						</view>
						<view class="amount">￥{{item.price}}</view>
					</view>
				</view>
				<view v-else>
					<view class="list u-skeleton-rect" v-for="(item,index) in 8" :key="index"></view>
				</view>
			</scroll-view>
			<!--引用组件-->
			<u-skeleton :loading="loading" :animation="true" bgColor="#edf4fa"></u-skeleton>
		</unicloud-db>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId: '12',
				loading: true
			}
		},
		onLoad() {
			setTimeout(() => {
				this.loading = false
			}, 3000)
		},
		onPullDownRefresh() {
			this.$refs.udb.refresh()
		},
		methods: {
			handleLoad(data, ended) {
				this.loadMoreStatus = ended ? 'nomore' : 'loadmore';
			},
			// scroll-view滚动到底部触发
			scrollBottom() {
				this.$refs.udb.loadMore()
			},
			// 路由跳转
			navTo(sp_id,good_id){
				// sp_id 服务人员id
				// good_id 消费包含服务项目
				uni.navigateTo({
				    url: `/pages/personal/record/detail?spId=${sp_id}&goodId=${encodeURIComponent(JSON.stringify(good_id))}`,
						success: (res)=>{
							console.log('跳转消费记录详情页-成功')
						},fail:(errRes)=>{
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
		height: 100vh;
		background-color: #edf4fa;

		.lists {
			.list {
				opacity: 0;
				height: 140rpx;
				position: relative;
				background-color: $uni-bg-color;
				margin-bottom: 20rpx;
				padding: 10rpx 20rpx 10rpx 50rpx;

				.block {
					position: relative;
					font-weight: normal;
					margin: 15rpx 0;

					.tit {
						color: $uni-text-color-grey;
						font-family: misansNormal;
					}

					.val {
						font-family: misansMedium;
					}

					&::before {
						position: absolute;
						display: block;
						content: ' ';
						width: 6rpx;
						height: 16rpx;
						left: -24rpx;
						top: 10rpx;
					}

					&:first-child {
						&::before {
							background-color: #38d0e8;
						}
					}

					&:nth-of-type(2) {
						&::before {
							background-color: #ffb552;
						}
					}
				}

				.amount {
					position: absolute;
					right: 20rpx;
					top: 20rpx;
					color: #ffb552;
					font-family: misansBold;
				}

				&.animation {
					opacity: 1;
					transition: all .8s;
				}

				@keyframes show {
					from {
						opacity: 0;
					}

					to {
						opacity: 1;
					}
				}
			}
		}
	}
</style>
