<template>
	<!-- 分享弹窗 -->
	<u-popup class="pop-container" v-model="shareSwitch" mode="bottom" :border-radius="10" :closeable="true" @close="popClose">
		<view class="popup-title">
			<text>分享</text>
		</view>
		<u-row class="u-m-t-40 u-m-b-50" gutter="16" justify="around">
			<u-col span="3" v-for="(list,index) in shareLists" :key="index" style="touch-action: none" @click="open(list)">
				<view class="u-m-b-10">
					<u-image width="100%" height="80rpx" :src="list.img" mode="aspectFit"></u-image>
				</view>
				<view class="u-flex u-row-center">
					<text class="u-tips-color">{{list.name}}</text>
				</view>
			</u-col>
		</u-row>
	</u-popup>
</template>

<script>
	export default {
		name:"ty-share",
		props:{
			// 分享组件展示状态
			show: {
				type: Boolean,
				default: false
			},
			// 分享组件具体内容
			options:{
				type: Object,
				default: {}
			}
		},
		watch:{
			show:function(val){
				this.shareSwitch = val
			}
		},
		data() {
			return {
				// 分享弹窗按钮
				shareSwitch: false,
				shareLists:[
					{name: '微信好友', id: 'weixin', scene: 'WXSceneSession', img: '/static/temp/share_wechat.png'},
					{name: '朋友圈', id: 'weixin', scene: 'WXSceneTimeline', img: '/static/temp/share_moment.png'},
					{name: 'QQ', id: 'qq', img: '/static/temp/share_qq.png'},
					{name: '微博', id: 'sinaweibo', img: '/static/temp/share_web.png'}
				]
			};
		},
		methods:{
			// 打开分享弹窗
			open(data){
				switch (data.id) {
				  case 'qq':
							// qq
				    break;
					case 'sinaweibo':
							// 微博
					  break;
					default:
							// 微信
						break;
				}
				uni.share({
					type: 0,
					provider: data.id,
					scene: data.scene || '',
					imageUrl: this.options.imageUrl,
					title: this.options.title,
					summary: this.options.summary,
					href: 'http://192.168.2.22:8080/demo/phn.html?username='+ this.userInfo.username + '&uuid=' + plus.device.uuid,
					success: (res)=> {
						this.shareSwitch = false
						console.log("success:" + JSON.stringify(res));
						// 分享成功对当前用户分享记录进行后端记录
					},
					fail: function (err) {
						console.log("fail:" + JSON.stringify(err));
					}
				})
			},
			// 关闭分享弹窗
			popClose(){
				this.$emit('changeShare',{state: false})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pop-container{
		.popup-title{
			text-align: center;
			height: 100rpx;
			line-height: 100rpx;
			font-size: $uni-font-size-lg;
		}
	}
</style>
