<template>
	<view class="warp">
		<!-- 首页搜索 -->
		<view class="search">
			<u-search placeholder="请输入服务项名称" v-model="searchVal" shape="round" bgColor="#fff"
				search-icon-color="#ffb552" :actionStyle="{'backgroundColor': '#ffb552','color': '#fff','padding': '10rpx 12rpx','borderRadius': '6rpx'}"></u-search>
		</view>
		<!-- 首页轮播 -->
		<u-swiper class="u-m-b-40" height="400" :list="banners"></u-swiper>
		<!-- 首页分类 -->
		<view class="classifys">
			<view class="classify" v-for="(list,index) in classifys" :key="index" @click="share(index)">
				<view class="icon">
					<u-icon :name="list.icon" color="#fff" size="48"></u-icon>
				</view>
				<view class="name">{{list.name}}</view>
			</view>
		</view>
		<!-- 首页推荐 -->
		<view class="home-title u-m-b-20">
			<view class="u-flex">
				<view class="title">今日推荐</view>
				<view class="block u-p-l-3">
					<u-icon class="icon" name="play-right-fill" color="#fff" size="20"></u-icon>
				</view>
			</view>
			<view class="tips">今日好货推荐，折后优惠</view>
		</view>
		<!-- 横向列表(新品推荐列表) -->
		<view class="cross u-m-b-20 skeleton">
			<scroll-view scroll-x="true">
				<view v-if="crossLists.length">
					<view class="cross-list" v-for="(list,index) in crossLists" :key="index">
						<u-image width="100%" height="200rpx" :src="list.goods_thumb"></u-image>
						<view class="u-p-12">
							<view class="name">{{list.name}}</view>
							<view class="tag">折后价</view>
							<view class="price">￥<text>{{list.price}}</text></view>
						</view>
					</view>
				</view>
				<view v-else>
					<view class="cross-list u-skeleton-rect" v-for="(item,index) in 3" :key="index"></view>
				</view>
			</scroll-view>
		</view>
		<!-- 纵向列表(分类精品列表) -->
		<view class="endlong">
			<u-tabs-swiper class="u-m-b-20" ref="tabs" :list="tabLists" :current="current" @change="tabsChange"
				:is-scroll="false" swiperWidth="750" bar-height="0" active-color="#ff8049"></u-tabs-swiper>
			<view class="endlong-swiper skeleton">
				<swiper :current="swiperCurrent" @change="swiperChange" style="height: 460rpx">
					<swiper-item class="swiper-item" v-for="(item, index) in tabLists" :key="index">
						<view v-if="!tabListLoading && endlongLists[index].length">
							<view class="endlong-list" v-for="(list,indexL) in endlongLists[index]" :key="indexL" @click="detailTo(list.goods_sn)">
								<view class="left">
									<u-image width="180rpx" height="180rpx" border-radius="20" :src="list.goods_thumb">
									</u-image>
								</view>
								<view class="right">
									<view class="name"><text>{{list.name || '商品名称'}}</text></view>
									<view class="describe"><text>{{list.goods_desc || '商品简介'}}</text></view>
									<view class="total_sales">已售<text
											class="sale_text">{{list.total_sell_count || 0}}</text>件</view>
									<view class="u-flex u-row-between">
										<view class="u-flex">
											<view class="price u-m-r-20">
												￥<text class="price_text">{{list.price || 0.00}}</text>
											</view>
											<view class="market_price">
												<text>￥{{list.market_price || 0.00}}</text>
											</view>
										</view>
										<view>
											<u-button :custom-style="customStyle" shape="circle" size="mini">立即购买
											</u-button>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="none" v-else-if="!tabListLoading && !endlongLists[index].length">
							<u-empty text="暂无数据" mode="list"></u-empty>
						</view>
						<view v-else>
							<view class="endlong-list u-skeleton-rect" v-for="(item,index) in 2" :key="index"></view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<ty-share :show="shareShow" @changeShare="changeShareShow" :options="shareOptions"></ty-share>
	</view>
</template>

<script>
	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	import tyShare from '@/components/ty-share/ty-share';
	export default {
		components:{
			tyShare
		},
		data() {
			return {
				searchVal: '',
				loading: true,
				banners: [{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],
				classifys: [{
						icon: 'car-fill',
						name: '家电数码'
					},
					{
						icon: 'bell-fill',
						name: '美食饮品'
					},
					{
						icon: 'taobao-circle-fill',
						name: '美妆个护'
					},
					{
						icon: 'bookmark-fill',
						name: '家居生活'
					},
					{
						icon: 'grid-fill',
						name: '其他周边'
					}
				],
				// 横向列表数据
				crossLists: [],
				// 纵向列表数据
				tabLists: [{
					name: '养老服务'
				}, {
					name: '护理服务'
				}, {
					name: '医疗服务'
				}, {
					name: '陪护服务'
				}],
				current: 0,
				swiperCurrent: 0,
				endlongLists: [[],[],[],[]],
				tabListLoading: true,
				// 按钮样式
				customStyle: {
					color: '#ff8049',
					fontFamily: 'misansNormal'
				},
				shareShow: false,
				shareOptions:{
					title: '一方家护下载',
					summary: '居家养老服务，优选一方家护！',
					imageUrl: 'https://qzapp.qlogo.cn/qzapp/100414805/95E24351203BC7D3654D050BAB5304FE/100',
				}
			}
		},
		async onLoad() {
			// #ifdef APP-PLUS
			console.log(plus.device.uuid)
			plus.device.getInfo({
					success:function(e){
						console.log('getOAID success: '+JSON.stringify(e));
					},
					fail:function(e){
						console.log('getOAID failed: '+JSON.stringify(e));
					}
				});
			// #endif
			// #ifdef H5
			const fp = await FingerprintJS.load();
			console.log(fp)
			const result = await fp.get();
			const visitorId = result.visitorId;
			console.log(visitorId);
			// #endif
			await this.getNews();
			await this.getRecommend(0);
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.current = index;
				this.swiperCurrent = index;
			},
			swiperChange(e) {
				this.current = e.detail.current;
				if (!this.endlongLists[this.current].length) {
					this.getRecommend(this.current);
				}
			},
			// 加载今日推荐数据
			async getNews() {
				const db = uniCloud.database();
				const dbCmd = db.command;
				let res = await db.collection('opendb-mall-goods').where({
					"remain_count": dbCmd.gt(0),
					"is_on_sale": true,
					"is_new": true
				}).get();
				res.result.data.forEach((list, index) => {
					this.crossLists.push(list)
				})
			},
			// 加载推荐服务数据
			async getRecommend(type) {
				this.tabListLoading = true;
				const db = uniCloud.database();
				const dbCmd = db.command;
				let res = await db.collection('opendb-mall-goods').limit(2).where({
					"goods_type": type.toString(),
					"remain_count": dbCmd.gt(0),
					"is_on_sale": true,
					"is_best": true
				}).get();
				res.result.data.forEach((list, index) => {
					this.endlongLists[type].push(list)
				})
				this.tabListLoading = false;
			},
			// 分享
			share(index){
				if(!index){
					console.log('进入')
					this.shareShow = true
				}else{
					uni.navigateTo({
						url: '/pages/public/download'
					})
				}
			},
			// 分享弹窗状态切换
			changeShareShow(e){
				this.shareShow = e.state
			},
			// 跳转详情页
			detailTo(id){
				uni.navigateTo({
					url: "/pages/home/service/detail?id=" + id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.warp {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding: 20rpx 0;

		.search {
			width: calc(100vw - 40rpx);
			margin: 0 auto 20rpx;
		}

		.classifys {
			display: flex;
			justify-content: space-around;
			margin-bottom: 30rpx;

			.icon {
				height: 110rpx;
				display: flex;
				justify-content: center;
				background-color: $uni-bg-color-main;
				border-radius: $uni-border-radius-circle;
				margin-bottom: 20rpx;
			}

			.name {
				color: $uni-text-color-subtitle;
			}
		}

		.home-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 25rpx;
			background: url('@/static/home/title_bj.png') no-repeat center;
			background-size: cover;

			.title {
				font-size: 38rpx;
				margin-right: 25rpx;
			}

			.block {
				display: flex;
				width: 32rpx;
				height: 32rpx;
				justify-content: center;
				align-items: center;
				background-color: $uni-bg-color-main;
				border-radius: $uni-border-radius-circle;
				padding-left: 3rpx;

				.icon {
					transform: scale(.7);
				}
			}

			.tips {
				color: $uni-text-color-subtitle;
				font-family: misansNormal;
				font-size: 26rpx;
			}
		}

		// 推荐列表
		.cross {
			width: calc(100vw - 40rpx);
			margin: 0 auto;
			white-space: nowrap;

			.cross-list {
				display: inline-block;
				flex-direction: column;
				width: 222rpx;
				margin-right: 22rpx;
				background-color: $uni-bg-color;
				border-radius: 18rpx;
				height: 400rpx;
				overflow: hidden;

				&:last-child {
					margin-right: 0;
				}

				.name {
					color: $uni-text-color-subtitle;
					font-size: 26rpx;
					margin-bottom: 10rpx;
					height: 74rpx;
					white-space: normal;
				}

				.tag {
					width: 100rpx;
					background-color: $uni-bg-color-main;
					border-radius: $uni-border-radius-lg;
					text-align: center;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-inverse;
					font-family: misansLight;
					margin-bottom: 20rpx;
				}

				.price {
					color: $uni-text-color-main;
				}
			}
		}
	}
</style>
