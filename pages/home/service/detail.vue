<template>
	<view class="warp">
		<u-swiper :list="list" height="340" mode="number" indicator-pos="bottomRight" bottom-number="40rpx"></u-swiper>
		<view class="main-container">
			<view class="float">
				<view class="line u-m-b-20">
					<text class="price">{{goodsInfo.price || 0}}￥</text>
					<text class="market_price">{{goodsInfo.market_price || 0}}￥</text>
				</view>
				<view class="line">
					<text class="name">{{goodsInfo.name || '名称'}}</text>
				</view>
				<view class="line">
					<text class="desc">{{goodsInfo.goods_desc || '简介'}}</text>
				</view>
				<u-form ref="uForm">
					<u-form-item class="address" label="详细地址:" label-width="150" :border-bottom="false">
						<u-input placeholder="请输入详细地址" v-model="detailAddress" trim></u-input>
						<slot>
							<u-icon name="map" size="42" color="#e26c39" @click="getLocation()"></u-icon>
						</slot>
					</u-form-item>
					<u-row class="basic-row u-m-t-30" gutter="16" justify="space-between">
						<u-col class="basic-col" span="3" v-for="(item,index) in basicItems.slice(0,4)" :key="index">
							<view class="value">{{item.value}}</view>
							<view class="name">{{item.name}}</view>
						</u-col>
					</u-row>
				</u-form>
				<u-picker mode="multiSelector" v-model="show" :range="range" :range-key="rangKey"
					:default-selector='rangeIndex' @confirm="pickerConfirm"></u-picker>
			</view>
			<view class="tag-wrap">
				<view class="tags">
					<view class="tag" v-for="(item,index) in tagList.slice(0,4)" :key="index">{{item.name}}</view>
				</view>
				<view class="tags">
					<view class="tag" v-for="(item,index) in tagList.slice(4,8)" :key="index">{{item.name}}</view>
				</view>
			</view>
			<view class="card" @tap="calendarShow = true">
				<u-row justify="around">
					<u-col span="4">
						<view class="title">入住时间</view>
						<view class="value">{{ orderInfo.startDate }}</view>
					</u-col>
					<u-col span="5">
						<view class="title">离开时间</view>
						<view class="value"><text class="date">{{ orderInfo.endDate }}</text><text
								class="week u-m-l-20">{{orderInfo.endWeek}}</text></view>
					</u-col>
					<u-col span="3" text-align="center">
						<text>共</text><text>{{dateDiff}}</text><text>晚</text>
						<text class="right">></text>
					</u-col>
				</u-row>
			</view>
		</view>
		<view class="warp-bottom">
			<view class="tags">
				<view class="tag">
					<u-icon size="40" color="red" name="bookmark-fill"></u-icon>
					<text class="text">收藏</text>
				</view>
			</view>
			<view class="buttons">
				<u-button class="button" type="success" size="small" plain>电话咨询</u-button>
				<button class="button btn-import" hover-class="btn-import-hover" @click="creatTo()">马上下单</button>
			</view>
		</view>
		<ty-share :show="shareShow" @changeShare="changeShareShow" :options="shareOptions"></ty-share>
		<u-toast ref="uToast" />
		<u-calendar v-model="calendarShow" mode="range" :min-date="nowDate" max-date="2099-12-31" active-bg-color="#ff9900" range-bg-color="rgba(255,153,0,.1)"
			range-color="#ffaf54" btn-type="warning" @change="calendarChange"></u-calendar>
	</view>
</template>

<script>
	import { getDate } from '@/common/index.js';
	import tyShare from '@/components/ty-share/ty-share';

	export default {
		components:{
			tyShare
		},
		data() {
			return {
				// 分享
				shareShow: false,
				shareOptions:{
					title: '一方家护下载',
					summary: '居家养老服务，优选一方家护！',
					imageUrl: 'https://qzapp.qlogo.cn/qzapp/100414805/95E24351203BC7D3654D050BAB5304FE/100',
				},
				// 商品信息
				goodsInfo: {},
				goods_sn: '',
				list: [{
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
				// 浮层模块数据
				address: {
					province: "江苏省",
					city: "南京市",
					district: "玄武区",
					poiName: "",
					street: "",
					streetNum: ""
				},
				show: false,
				rangKey: 'name',
				range: [
					[{
							name: '江苏省',
							value: '1'
						},
						{
							name: '广东省',
							value: '2'
						}
					],
					[{
						name: '南京市',
						value: '1'
					}],
					[{
							name: '玄武区',
							value: '1'
						},
						{
							name: '秦淮区',
							value: '2'
						},
						{
							name: '建邺区',
							value: '3'
						},
						{
							name: '鼓楼区',
							value: '4'
						},
						{
							name: '浦口区',
							value: '5'
						},
						{
							name: '栖霞区',
							value: '6'
						},
						{
							name: '雨花台区',
							value: '7'
						},
						{
							name: '江宁区',
							value: '8'
						},
						{
							name: '六合区',
							value: '9'
						},
						{
							name: '溧水区',
							value: '10'
						},
						{
							name: '高淳区',
							value: '11'
						},
					]
				],
				rangeIndex: [0, 0, 0],
				// 基本信息
				basicItems: [{
						name: '面积',
						value: '20m²'
					},
					{
						name: '早餐',
						value: '含早餐'
					},
					{
						name: '适合人数',
						value: '1~2人'
					},
					{
						name: '楼层',
						value: '4-8楼'
					}
				],
				tagList: [{
						name: '低盐低脂'
					},
					{
						name: '南京南'
					},
					{
						name: '提供送餐'
					},
					{
						name: '提供堂食'
					},
					{
						name: '免费餐具'
					},
					{
						name: '中餐'
					},
					{
						name: '晚餐'
					}
				],
				orderInfo: {
					startDate: '',
					endDate: '',
					endWeek: ''
				},
				nowDate: '',
				calendarShow: false
			}
		},
		watch: {
			rangeIndex: {
				handler: function(newVal, oldVal) {
					this.address.province = this.range[0][newVal[0]].name
					this.address.city = this.range[1][newVal[1]].name
					this.address.district = this.range[2][newVal[2]].name
				},
				deep: true
			}
		},
		computed: {
			detailAddress: function() {
				return this.address.street + this.address.streetNum + this.address.poiName
			},
			// 日期差
			dateDiff: function() {
				var sDate = new Date(this.orderInfo.startDate || getDate());
				var eDate = new Date(this.orderInfo.endDate || getDate('next'));
				var days = eDate.getTime() - sDate.getTime();
				var day = parseInt(days / (1000 * 60 * 60 * 24));
				return day;
			}
		},
		async onLoad(options) {
			this.orderInfo.startDate = await getDate()
			this.nowDate = await getDate()
			this.orderInfo.endDate = await getDate('next')
			this.orderInfo.endWeek = await getDate('week')
			// 加载服务详情
			await this.loadDetails(options.id || 0)
			await this.getLocation()
		},
		methods: {
			loadDetails(id) {
				const db = uniCloud.database();
				const dbCmd = db.command;
				db.collection('opendb-mall-goods').where({
					goods_sn: id
				}).get().then((res) => {
					console.log(res)
					if (!res.result.code) {
						this.goodsInfo = res.result.data[0]
					} else {
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
			},
			// 获取定位
			getLocation() {
				uni.showLoading({
					title: '地址获取中...'
				})
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: (res) => {
						console.log(res)
						this.address = res.address
						this.latitude = res.latitude
						this.longitude = res.longitude
					},
					fail: (res) => {
						console.log(res)
					},
					complete: (res) => {
						uni.hideLoading()
					}
				});
			},
			// picker确认
			pickerConfirm(e) {
				console.log(e)
				this.rangeIndex = e
			},
			// 日期确认事件
			calendarChange(e) {
				this.orderInfo.startDate = e.startDate
				this.orderInfo.endDate = e.endDate
				this.orderInfo.endWeek = e.endWeek
			},
			// 页面跳转
			navTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			// 去下单
			creatTo(){
				uni.navigateTo({
					url: `/pages/home/service/creat?info=${JSON.stringify(this.goodsInfo)}`
				})
			},
			//点击导航栏 buttons 时触发
			onNavigationBarButtonTap(e) {
				const index = e.index;
				console.log(index)
				if(!index){
					this.shareShow = true
				}
			},
			// 分享弹窗状态切换
			changeShareShow(e){
				this.shareShow = e.state
			},
		}
	}
</script>

<style lang="scss" scoped>
	.warp {
		.main-container {
			position: relative;
			background-color: #3ebc98;
			height: calc(100vh - 340rpx);
			padding-top: 390rpx;

			.float {
				height: 400rpx;
				position: absolute;
				background-color: $uni-bg-color;
				border-radius: 20rpx;
				top: -20rpx;
				left: 0;
				right: 0;
				padding: $uni-spacing-row-lg $uni-spacing-row-xl;
				box-shadow: 0 0 6rpx #666666;

				.line {
					margin-bottom: 6rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;

					.price {
						font-size: 36rpx;
						color: $u-type-error-dark;
					}

					.market_price {
						color: $uni-text-color-disable;
						text-decoration: line-through;
						font-size: $uni-font-size-sm;
						margin-left: $uni-spacing-row-base;
					}

					.name {
						font-family: misansBold;
					}

					.desc {
						color: $uni-text-color-grey;
						font-size: $uni-font-size-sm;
					}
				}


				.address {
					padding: 5rpx 15rpx;
					border-radius: $uni-border-radius-lg;
					border: 1px solid #dadee6;
					color: $font-color-light;

					.value {
						color: $font-color-base;
					}

					.location {
						position: relative;

						&::before {
							position: absolute;
							display: block;
							content: ' ';
							width: 2rpx;
							height: 100%;
							background-color: #dadee6;
							left: -10rpx;
							top: 0;
						}
					}
				}

				.basic-row {
					width: 100vw;
					margin-left: -40rpx;

					.basic-col {
						.name {
							color: $uni-text-color-grey;
							font-size: $uni-font-size-sm;
							text-align: center;
						}

						.value {
							text-align: center;
						}
					}
				}
			}

			.tag-wrap {
				width: calc(100vw - 80rpx);
				margin: 0 auto 10rpx;
				padding: 20rpx 0;

				.tags {
					display: flex;
					justify-content: flex-start;
					margin-bottom: 20rpx;

					.tag {
						width: calc(25% - 20rpx);
						margin-right: 20rpx;
						background-color: rgba(255, 255, 255, .4);
						border-radius: $uni-border-radius-base;
						padding: 10rpx 0;
						font-size: $uni-font-size-sm;
						color: $font-color-base;
						font-family: misansNormal;
						text-align: center;
					}

					&:last-child {
						margin-bottom: 0;
					}
				}
			}

			.block {
				width: calc(100vw - 40rpx);
				margin: 0 20rpx;
				background-color: $uni-bg-color;
				border-radius: $uni-border-radius-lg;
				padding: 20rpx;
				margin-bottom: 20rpx;
				border: 5rpx solid #e6e6e6;
				transition: all .8s;

				&.active {
					border-color: $uni-color-primary;
				}

				.line {}

			}
		}

		.btn-import {
			display: inline-flex;
			width: auto;
			font-size: 26rpx;
			height: 70rpx;
			line-height: 70rpx;
			padding: 0 50rpx;
			background-image: linear-gradient(#ffbb8e, #ff8049);
			color: $uni-text-color-inverse;
			border-color: $uni-text-color-main;
		}

		.btn-import-hover {
			background-image: linear-gradient(#e2a37f, #e26e40);
			color: $uni-text-color-inverse;
			border-color: $uni-text-color-main;
		}
	}
</style>
