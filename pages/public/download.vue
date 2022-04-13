<template>
	<view class="warp">
		<u-button type="primary" @click="download">下载</u-button>
		<text>{{model}}</text>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				model: ''
			}
		},
		methods:{
			// 下载app
			download(){
				var md = new MobileDetect(window.navigator.userAgent);
				var model = md.mobile();
				this.model = model;
				// const dbCmd = db.command;
				// let res = await db.collection('opendb-stat-share-logs').add({
				// 	appid: 
				// });
			}
		}
	}
</script>

<style>
</style>
