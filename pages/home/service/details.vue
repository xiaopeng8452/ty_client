<template>
	<view class="warp">
		<!-- <u-swiper :list="list" height="400" mode="number" indicator-pos="bottomRight"></u-swiper> -->
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
			<!-- <view class="tags">
				<view class="tag" v-for="(item,index) in tagList" :key="index">{{item.name}}</view>
			</view> -->
			<view class="lists">
				<view class="list" :class="{active: selectSiteId == list.id}" v-for="(list,index) in sites" :key="index"
					@click="changeSite(list.id)">
					<u-row gutter="16">
						<u-col span="8">
							<view>{{list.name}}</view>
							<view class="u-flex line">
								<view>
									<u-icon name="photo"></u-icon>
								</view>
								<view>{{list.address}}</view>
							</view>
							<view class="u-flex line">
								<view>
									<u-icon name="photo"></u-icon>
								</view>
								<view>营业时间：{{list.times}}</view>
							</view>
						</u-col>
						<u-col span="1">
							<u-line color="#b1b1b1" length="140rpx" direction="col" />
						</u-col>
						<u-col class="u-text-center" span="3">
							<view>去下单</view>
							<view>{{'距离：'+ list.distance}}</view>
						</u-col>
					</u-row>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const subNVue = uni.getSubNVueById('map');
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
						name: '近地铁'
					},
					{
						name: '火车站'
					}
				],
				// 选择站点模块
				latitude: '32.059344',
				longitude: '118.796624',
				sites: [{
						name: '仁善养老机构',
						id: '12',
						address: '江苏省南京市鼓楼区天和大厦203室',
						times: '11:30-13:00',
						tel: '0251324242',
						latitude: '32.010538',
						longitude: '118.732210',
						distance: '999km'
					},
					{
						name: '悦馨养老机构',
						id: '13',
						address: '江苏省南京市江宁区华福路1305号华泰中心底商',
						times: '11:30-13:00',
						tel: '0251324243',
						latitude: '31.988701',
						longitude: '118.807569',
						distance: '999km'
					},
				],
				selectSiteId: '12'
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
			// 计算距离
			this.distance()
			uni.$on('markerClick', (data) => {
				if (data.siteId) {
					this.selectSiteId = data.siteId
				}
			})
		},
		onReady() {
			this._mapContext = uni.createMapContext("map", this);
			this.getLocation();
		},
		// 页面返回
		onBackPress(options) {
			console.log(options)
		},
		methods: {
			async loadDetails(id) {
				const db = uniCloud.database();
				const dbCmd = db.command;
				let res = await db.collection('opendb-mall-goods').where({
					goods_sn: id
				}).get()
			},
			// picker确认
			pickerConfirm(e) {
				console.log(e)
				this.rangeIndex = e
			},
			// 加载map
			loadMap() {
				uni.$emit('loadSubNVue', {
					state: true
				})
				subNVue.show('zoom-out	', 200)
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
						// 打开地图预览
						this.loadMap();
					},
					fail: (res) => {
						console.log(res)
					},
					complete: (res) => {
						uni.hideLoading()
					}
				});
			},
			// 切换选择站点
			changeSite(id) {
				this.selectSiteId = id
				uni.$emit('changeSite', {
					siteId: id
				})
			},
			// 计算站点与定位距离
			distance() {
				this.sites.forEach((site, index) => {
					var point1 = new plus.maps.Point(this.longitude, this.latitude);
					var point2 = new plus.maps.Point(site.longitude, site.latitude);
					plus.maps.Map.calculateDistance(point1, point2, (event) => {
						this.sites[index].distance = (event.distance / 1000).toFixed(2) + 'km'; // 转换后的距离值
					}, (e) => {
						console.log(e)
					});
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
			height: 1000rpx;
			padding-top: 830rpx;

			.float {
				height: 240rpx;
				position: absolute;
				background-color: $uni-bg-color;
				border-radius: 25rpx;
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

			.tags {
				width: calc(100vw - 80rpx);
				margin: 0 auto;
				padding: 40rpx 0;

				.tag {
					float: left;
					margin: 10rpx;
					background-color: rgba(255, 255, 255, .4);
					border-radius: $uni-border-radius-base;
					padding: 10rpx 15rpx;
					font-size: $uni-font-size-sm;
					color: $font-color-base;
					font-family: misansNormal;
				}
			}

			.block,
			.list {
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
