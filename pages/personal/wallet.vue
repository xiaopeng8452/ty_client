<template>
	<view class="warp">
		<unicloud-db ref="udb" @load="handleLoad" v-slot:default="{data, loading, pagination, error, options}"
			collection="ty-coupons" :where="{'user_id':userInfo._id}">
			<scroll-view class="lists u-skeleton" :scroll-y="true" @scrolltolower="scrollBottom">
				<view v-if="!loading">
					<view class="list transition" v-for="(item,index) in data"
						:style="{transitionDelay:index*.25 + 's'}" :key="index" :options="btnOptions" @click="navTo()">
						<u-row :class="{overdue:judgeExpired(item.expire_date)}" gutter="20">
							<u-col span="3" style="padding-left: 0;">
								<view class="vice-coupon" :class="['success','warning','primary','error'][item.type]">
									<view class="u-flex-col u-row-center">
										<view class="u-text-center u-m-b-10">
											<text class="u-font-40 u-m-r-5">{{[item.back_amount * 100,item.discount,item.amount, '全场'][item.type]}}</text>
											<text class="u-font-22">{{['%','折','￥',''][item.type]}}</text>
										</view>
										<view class="u-font-26 u-text-center">{{['返现','折扣','满减','免单'][item.type]}}</view>
									</view>
								</view>
							</u-col>
							<u-col span="9" style="padding-right: 20rpx;">
								<view class="paper">
									<view class="top">
										<u-row>
											<u-col span="10">
												<view class="name">{{item.name}}</view>
												<view class="describe">{{item.describe}}</view>
											</u-col>
											<u-col span="2">
												<u-image v-if="judgeExpired(item.expire_date)" class="overdue_img" width="90rpx" mode="widthFix" src="/static/personal/overdue.png"></u-image>
											</u-col>
										</u-row>
									</view>
									<u-gap height="2" bg-color="#f5f5f5"></u-gap>
									<view class="bottom">
										<text class="effective_text u-m-r-10">有效期至</text>
										<text class="expire_date">{{$u.timeFormat(item.expire_date, 'yyyy-mm-dd hh:MM:ss')}}</text>
									</view>
								</view>
							</u-col>
						</u-row>
					</view>
				</view>
				<view v-else>
					<view class="list u-skeleton-rect" v-for="(item,index) in 3" :key="index"></view>
				</view>
			</scroll-view>
			<!--引用组件-->
			<u-skeleton :loading="loading" :animation="true" bgColor="#edf4fa"></u-skeleton>
		</unicloud-db>
		<view class="fixed-btn" @click="addCoupons">
			<u-icon name="plus" color="#fff" size="44"></u-icon>
		</view>
		<u-modal v-model="modalShow" @confirm="confirm" title="优惠券兑换" ref="uModal" :show-cancel-button="true"
			:async-close="true">
			<view class="modal-content">
				<u-input v-model="value" :border="true" placeholder="请输入兑换码" maxlength="14" />
			</view>
		</u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		getDate
	} from '@/common/index.js';
	const db = uniCloud.database();
	export default {
		data() {
			return {
				modalShow: false,
				value: '',
				couponsInfo: {
					name: '分享优惠券',
					type: 2,
					describe: 'app分享专享优惠券，满99减5',
					amount: 5,
					times: false,
					redeem_code: this.$u.guid(14),
					expire_date: new Date().getTime() + (6* 3600)
				},
				btnOptions: [
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			}
		},
		onLoad() {},
		onPullDownRefresh() {
			console.log('aaa')
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
			// 判断优惠券是否过期
			judgeExpired(time){
				const nowTime = new Date();
				return nowTime >= time;
			},
			// 添加优惠券
			addCoupons() {
				db.collection('ty-coupons').add(this.couponsInfo).then((res) => {
						console.log(res)
						if (!res.result.code) {
							this.$refs.uToast.show({
								title: '添加成功',
								type: 'success'
							})
						} else {
							this.$refs.uToast.show({
								title: res.result.message,
								type: 'success'
							})
						}
					}).catch((err) => {
						this.$refs.uToast.show({
							title: err.message,
							type: 'error'
						})
					})
					.finally(() => {
						uni.hideLoading()
					});
			},
			// 兑换码确认
			confirm() {
				if (this.value.length === 14) {
					db.collection('ty-coupons').where({
							redeem_code: this.value,
						}).update({
							user_id: this.userInfo._id
						}).then((res) => {
							console.log(res)
							if (!res.result.code) {
								this.$refs.uToast.show({
									title: '兑换成功',
									type: 'success'
								})
								this.value = ''
							} else {
								this.$refs.uModal.clearLoading();
								this.$refs.uToast.show({
									title: res.result.message,
									type: 'warning'
								})
							}
						}).catch((err) => {
							this.$refs.uToast.show({
								title: err.message,
								type: 'error'
							})
						})
						.finally(() => {
							uni.hideLoading()
						});
					setTimeout(() => {
						// 3秒后自动关闭
						this.modalShow = false;
					}, 1000)
				} else {
					this.$refs.uModal.clearLoading();
					this.$refs.uToast.show({
						title: '请输入有效优惠券',
						type: 'warning'
					})
				}
			},
			//点击导航栏 buttons 时触发
			onNavigationBarButtonTap(e) {
				const index = e.index;
				if (!index) {
					this.modalShow = true
					this.value = this.copyToClip().length == 14?this.copyToClip(): ''
				}
			},
			navTo() {

			},
			// 安卓获取剪切板内容
			// #ifdef APP-PLUS
			copyToClip() {
				var Context = plus.android.importClass("android.content.Context");
				var main = plus.android.runtimeMainActivity();
				var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
				return plus.android.invoke(clip, "getText");
			}
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	.warp {
		height: 100vh;
		background-color: #f3f3f3;
		padding-top: 20rpx;

		.lists {
			width: calc(100vw - 40rpx);
			margin: 0 20rpx;
			.list {
				position: relative;
				opacity: 0;
				margin-bottom: 20rpx;
				height: 170rpx;
				background-color: $uni-bg-color;
				border-radius: 10rpx;
				overflow: hidden;
				&::before{
					content: '';
					position: absolute;
					left: -4rpx;
					top: 50%;
					transform: translate(-50%, -50%);
					width: 20rpx;
					height: 20rpx;
					background-color: #f3f3f3;
					border-radius: $uni-border-radius-circle;
					z-index: 1;
				}
				&::after{
					content: '';
					position: absolute;
					right: -12rpx;
					top: 50%;
					transform: translate(0, -50%);
					width: 20rpx;
					height: 20rpx;
					background-color: #f3f3f3;
					border-radius: $uni-border-radius-circle;
					z-index: 1;
				}
				.overdue{
					.vice-coupon{
						background-color: #dcdcdc !important;
					}
					.name,.describe,.expire_date,.effective_text{
						color: #cbcbcb !important;
					}
				}
				.vice-coupon{
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					background-color: #18B566;
					height: 170rpx;
					color: $uni-text-color-inverse;
					&:after{
						content: '';
						position: absolute;
						top: 0;
						bottom: 0;
						right: -14rpx;
						width: 20rpx;
						height: 100%;
						background: radial-gradient(circle, #fff, #fff 8rpx, transparent 10rpx);
						background-size: 20rpx 20rpx;
					}
					&.primary{
						background-color: #90deff;
					}
					&.warning{
						background-color: #ff9900;
					}
					&.success{
						background-color: #19be6b;
					}
					&.error{
						background-color: #fa3534;
					}
				}
				.paper{
					padding-top: 10rpx;
					.top{
						position: relative;
						.name{
							font-size: $uni-font-size-lg;
							color: $uni-text-color;
							margin-bottom: 15rpx;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
						.describe{
							font-size: 22rpx;
							color: $uni-text-color-placeholder;
							margin-bottom: 15rpx;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
						.overdue_img{
							position: absolute;
							top: -5rpx;
							right: 10rpx;
						}
					}
					.bottom{
						padding: 10rpx 0;
						.effective_text,.expire_date{
							font-size: 22rpx;
							color: $u-type-error;
						}
					}
				}
			}
		}
	}

	.modal-content {
		padding: 30rpx 40rpx;
	}
</style>
