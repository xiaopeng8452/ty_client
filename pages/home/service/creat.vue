<template>
	<view class="warp">
		<view class="endlong-list">
			<view class="left">
				<u-image width="180rpx" height="180rpx" border-radius="20" :src="goodsInfo.goods_thumb">
				</u-image>
			</view>
			<view class="right">
				<view class="name"><text>{{goodsInfo.name || '商品名称'}}</text></view>
				<view class="describe"><text>{{goodsInfo.goods_desc || '商品简介'}}</text></view>
				<view class="total_sales">已售<text class="sale_text">{{goodsInfo.total_sell_count || 0}}</text>件</view>
				<view class="u-flex u-row-between">
					<view class="u-flex">
						<view class="price u-m-r-20">
							￥<text class="price_text">{{goodsInfo.price || 0.00}}</text>
						</view>
						<view class="market_price">
							<text>￥{{goodsInfo.market_price || 0.00}}</text>
						</view>
					</view>
					<view>
					</view>
				</view>
			</view>
		</view>
		<view class="form-card">
			<u-form :model="orderInfo" ref="uForm" label-position="left" label-width="150" :label-style="{color: '#999'}">
				<u-form-item label="服务对象">
					<u-input v-model="userInfo.nickname" placeholder="请输入服务对象姓名" trim disabled />
				</u-form-item>
				<u-form-item label="联系方式">
					<u-input v-model="userInfo.mobile" placeholder="请输入联系方式" trim disabled />
				</u-form-item>
				<u-form-item label="预约日期" prop="make_date">
					<u-input v-model="orderInfo.make_date" type="select" placeholder="请选择服务日期" @click="calendarShow = true" />
				</u-form-item>
				<u-form-item label="预约时间" prop="make_time">
					<u-input v-model="orderInfo.make_time" type="select" placeholder="请选择服务时间" @click="sheetShow = true" />
				</u-form-item>
			</u-form>
		</view>
		<u-button class="submit-btn" type="warning" @click="submit">提交</u-button>
		<u-calendar v-model="calendarShow" mode="date" :min-date="nowDate" max-date="2099-12-31" active-bg-color="#ff9900" btn-type="warning" @change="calendarChange"></u-calendar>
		<u-action-sheet :list="timeSheetList" v-model="sheetShow" @click="timeSheetCallback"></u-action-sheet>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { getDate } from '@/common/index.js';
	export default {
		data() {
			return {
				goodsInfo: {},
				rules: {
					make_date: [{
						required: true,
						message: '请选择服务日期',
						// 可以单个或者同时写两个触发验证方式 
						trigger: 'change',
					}],
					make_time: [{
						required: true,
						message: '请选择服务时间',
						trigger: 'change'
					}]
				},
				orderInfo: {
					type: '服务订单'
				},
				calendarShow: false,
				sheetShow: false,
				nowDate: '',
				timeSheetList:[
					{text: '09:00'},
					{text: '11:00'},
					{text: '13:00'},
					{text: '15:00'}
				]
			}
		},
		onLoad(options) {
			this.goodsInfo = JSON.parse(options.info)
			// 订单基本信息初始化
			
			this.orderInfo.title = this.goodsInfo.name
			this.orderInfo.type = '商品订单'
			this.orderInfo.total_fee = this.goodsInfo.price
			this.orderInfo.user_id = this.userInfo._id
			this.orderInfo.make_date = getDate()
			this.nowDate = getDate()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 服务日期选择回调
			calendarChange(e){
				let selectDateTime = e.result + ' ' + (this.orderInfo.make_time || '23:59') + ':00';
				let nowDateTime  = getDate('dateTime');
				console.log(selectDateTime,nowDateTime)
				if(this.compareDate(selectDateTime,nowDateTime)){
					this.orderInfo.make_date = e.result
				}else{
					this.$refs.uToast.show({
						title: '请选择有效时间',
						type: 'warning'
					})
				}
			},
			// 服务时间选择回调
			timeSheetCallback(e){
				let selectDateTime = this.orderInfo.make_date + ' ' + this.timeSheetList[e].text + ':00';
				let nowDateTime  = getDate('dateTime');
				if(this.compareDate(selectDateTime,nowDateTime)){
					this.orderInfo.make_time = this.timeSheetList[e].text;
				}else{
					this.$refs.uToast.show({
						title: '请选择有效时间',
						type: 'warning'
					})
				}
			},
			// 根据日期自动计算可选服务时间
			calculateDateToTime(){
				
			},
			compareDate(beginDate, endDate) {
				var d1 = new Date(beginDate.replace(/\-/g, "\/"));
				var d2 = new Date(endDate.replace(/\-/g, "\/"));
				if (beginDate != "" && endDate != "" ) {
					return d1 >= d2;
				}
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showLoading({
							title: '数据提交中...'
						})
						this.loading = true
						uniCloud.database().collection('uni-id-base-order').add(this.orderInfo).then((res) => {
								this.$refs.uToast.show({
									title: '新增成功',
									type: 'success',
									duration: 1000,
									back: true
								})
								uni.$emit('refresh', true)
							})
							.catch((err) => {
								this.$refs.uToast.show({
									title: err.message,
									type: 'error'
								})
							})
							.finally(() => {
								uni.hideLoading()
								this.loading = false
							});
					} else {
						console.log('验证失败');
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.warp {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-top: $uni-spacing-row-sm;
		.form-card{
			width: calc(100vw - 40rpx);
			margin: 0 20rpx;
			background-color: $uni-bg-color;
			border-radius: 20rpx;
			padding: 30rpx;
		}
		/* 提交按钮 */
		.submit-btn{
			position: fixed;
			width: calc(100vw - 40rpx);
			bottom: 30rpx;
			left: $uni-spacing-row-base;
		}
	}
</style>
