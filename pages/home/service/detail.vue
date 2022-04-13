<template>
	<view class="warp">
		<u-swiper :list="list" height="400" mode="number" indicator-pos="bottomRight"></u-swiper>
		<view class="main-container">
			<view class="float">
				<u-form ref="uForm">
					<u-form-item class="address u-m-b-20" label="所属区域:" label-width="150" :border-bottom="false">
						<u-input placeholder="请输入详细地址" type="select" @click="show = true" v-model="area" trim></u-input>
					</u-form-item>
					<u-form-item class="address" label="详细地址:" label-width="150" :border-bottom="false">
						<u-input placeholder="请输入详细地址" v-model="detailAddress" trim></u-input>
						<slot>
							<u-icon name="map" size="42" color="#e26c39" @click="getLocation()"></u-icon>
						</slot>
					</u-form-item>
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
			<navigator url="/pages/public/sites?source=1">
				<view class="block">
					<view>{{buffetInfo.name}}</view>
					<view>{{buffetInfo.proName}}{{buffetInfo.cityName}}{{buffetInfo.countyName}}{{buffetInfo.addr}}</view>
				</view>
			</navigator>
			<view class="block">
				<view>{{siteInfo.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
				// 选择站点模块
				siteInfo: {},
				buffetInfo:{
					name: '张三',
					address: '',
					proName: '江苏省',
					cityName: '南京市',
					countyName: '建邺区',
					proId: '11',
					cityId: '4530',
					countyId: '4533',
					addr: '今日家园丹桂居10栋2单元403'
				}
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
			area: {
				get: function() {
					return this.address.province + '-' + this.address.city + '-' + this.address.district
				},
				set: function(newVal) {
					var areas = newVal.split('-')
					this.address.province = areas[0]
					this.address.city = areas[1]
					this.address.district = areas[2]
				}
			},
			detailAddress: function() {
				return this.address.street + this.address.streetNum + this.address.poiName
			}
		},
		onLoad(options) {
			// 加载服务详情
			this.loadDetails(options.id)
			this.siteInfo = getApp().globalData.sites[0]
			this.getLocation()
		},
		methods: {
			async loadDetails(id) {
				const db = uniCloud.database();
				const dbCmd = db.command;
				let res = await db.collection('opendb-mall-goods').where({
					goods_sn: id
				}).get()
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
			// 页面跳转
			navTo(url){
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.warp {
		.main-container {
			position: relative;
			background-color: #3ebc98;
			height: calc(100vh - 230rpx);
			padding-top: 230rpx;

			.float {
				height: 240rpx;
				position: absolute;
				background-color: $uni-bg-color;
				border-radius: 30rpx;
				top: -20rpx;
				left: 0;
				right: 0;
				padding: 20rpx;

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
			}
			.tag-wrap{
				width: calc(100vw - 80rpx);
				margin: 0 auto;
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
					&:last-child{
						margin-bottom: 0;
					}
				}
			}

			.block{
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
	}
</style>
