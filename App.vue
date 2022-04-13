<script>
	export default {
		// 此处globalData为了演示其作用，不是uView框架的一部分
		globalData: {
			username: '白居易',
			sites: [{
				name: '悦馨养老机构',
				id: '13',
				address: '江苏省南京市江宁区华福路1305号华泰中心底商',
				times: '11:30-13:00',
				tel: '0251324243',
				latitude: '31.988701',
				longitude: '118.807569',
				distance: 99999,
				distanceStr: '999km'
			}, {
				name: '仁善养老机构',
				id: '12',
				address: '江苏省南京市鼓楼区天和大厦203室',
				times: '11:30-13:00',
				tel: '0251324242',
				latitude: '32.010538',
				longitude: '118.732210',
				distance: 99999,
				distanceStr: '999km'
			}],
			latitude: '32.059344',
			longitude: '118.796624'
		},
		onLaunch() {
			// 1.1.0版本之前关于http拦截器代码，已平滑移动到/common/http.interceptor.js中
			// 注意，需要在/main.js中实例化Vue之后引入如下(详见文档说明)：
			// import httpInterceptor from '@/common/http.interceptor.js'
			// Vue.use(httpInterceptor, app)
			// process.env.VUE_APP_PLATFORM 为通过js判断平台名称的方法，结果分别如下：
			/**
			 * h5，app-plus(nvue下也为app-plus)，mp-weixin，mp-alipay......
			 */
			// var device_type = this.navitgator.userAgent;
			// var md = new MobileDetect(device_type);
			// console.log(device_type)
			
			// 读取storage
			const userInfo = uni.getStorageSync('userInfo');
			if(userInfo.status === 0){
				this.$u.vuex('hasLogin', true);
				this.$u.vuex('userInfo', userInfo);
			}
			
			// 定位功能
			uni.getLocation({
				type: 'gcj02',
				geocode: true,
				success: (res) => {
					// 向globalData添加当前位置
					getApp().globalData.latitude = res.latitude
					getApp().globalData.longitude = res.longitude
					getApp().globalData.sites.forEach((site, index) => {
						var point1 = new plus.maps.Point(res.longitude, res.latitude);
						var point2 = new plus.maps.Point(site.longitude, site.latitude);
						plus.maps.Map.calculateDistance(point1, point2, (event) => {
							getApp().globalData.sites[index].distance = event.distance
							getApp().globalData.sites[index].distanceStr = (event.distance /
									1000).toFixed(2) +
								'km'; // 转换后的距离值
							if (index == getApp().globalData.sites.length - 1) {
								getApp().globalData.sites.sort((site1, site2) => {
									var distance1 = site1.distance;
									var distance2 = site2.distance;
									return distance1 > distance22 ? 1 : -1;
								})
								console.log(getApp().globalData.sites)
							}
						}, (e) => {
							console.log(e)
						});
					})
				},
				fail: (res) => {
					console.log(res)
				},
				complete: (res) => {
					uni.hideLoading()
				}
			});
		}
	}
</script>

<style lang="scss">
	/* #ifndef APP-NVUE */
	@import "uview-ui/index.scss";
	@import "common/demo.scss";
	@import 'common/font/font.css';

	div,
	view,
	text {
		font-family: misansMedium;
	}

	/* #endif */
</style>
