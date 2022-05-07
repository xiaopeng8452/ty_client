<script>
	export default {
		// 此处globalData为了演示其作用，不是uView框架的一部分
		globalData: {
			username: '白居易'
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

	::-webkit-scrollbar {  
	    display: none;  
	    width: 0 !important;  
	    height: 0 !important;  
	    -webkit-appearance: none;  
	    background: transparent;  
	}
	/* #endif */
</style>
