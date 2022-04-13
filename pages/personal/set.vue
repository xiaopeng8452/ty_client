<template>
	<view class="warp">
		<u-cell-group title="个人信息">
			<u-cell-item class="cell-avatar" title="头像" :arrow="false" @click="changeAvatar">
				<u-avatar :src="userInfo.avatar" size="80"></u-avatar>
			</u-cell-item>
			<u-cell-item title="姓名" :value="userInfo.nickname" @click="openModal('nickname')"></u-cell-item>
			<u-cell-item title="电话" :value="userInfo.mobile" @click="openModal('mobile')"></u-cell-item>
			<u-cell-item title="性别" :value="['未知','男','女'][userInfo.gender]" @click="pickerShow = true"></u-cell-item>
		</u-cell-group>
		<u-button class="bottom-btn" type="warning" @click="loginOut()" :disabled="loading">退出登录</u-button>
		<!-- 操作模态窗 -->
		<u-modal ref="uModal" v-model="modalShow" show-cancel-button :title="modalTitle" :async-close="true"
			@confirm="confirm">
			<view class="slot-content">
				<u-input v-model="modalInput" :placeholder="'请输入您的' + modalPlaceholder" />
			</view>
		</u-modal>
		<!-- 选择器 -->
		<u-picker v-model="pickerShow" mode="selector" :range="genderRanges" range-key="text"
			:defaultSelector="[userInfo.gender]" @confirm="pickerConfirm">
		</u-picker>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				loading: false,
				modalShow: false,
				modalType: '',
				modalTitle: '个人信息',
				modalInput: '',
				modalPlaceholder: '',
				pickerShow: false,
				genderRanges: [{
						text: '未知',
						value: 0
					},
					{
						text: '男',
						value: 1
					},
					{
						text: '女',
						value: 2
					}
				]
			}
		},
		onLoad() {
			console.log(this.userInfo)
		},
		methods: {
			// 路由跳转
			navTo(url) {
				uni.navigateTo({
					url: url,
					success: (res) => {
						console.log('跳转消费记录签字-成功')
					},
					fail: (errRes) => {
						uni.showToast({
							title: errRes.errMsg
						})
					}
				})
			},
			// 打开模态窗
			openModal(title) {
				this.modalType = title
				switch (title) {
					case 'nickname':
						// 姓名
						this.modalTitle = '姓名'
						this.modalPlaceholder = '姓名'
						this.modalInput = this.userInfo.nickname

						break;
					default:
						// 电话
						this.modalTitle = '电话'
						this.modalPlaceholder = '电话'
						this.modalInput = this.userInfo.mobile
						break;
				}
				this.modalShow = true
			},
			// 模态框确认事件
			confirm() {
				this.modalShow = false
				uni.showLoading({
					title: '修改中...'
				})
				switch (this.modalType) {
					case 'nickname':
						// 姓名
						db.collection("uni-id-users").where({
							username: this.userInfo.username
						}).update({
							nickname: this.modalInput
						}).then((res) => {
							uni.showToast({
								title: '修改成功'
							})
							this.$u.vuex('userInfo.nickname', this.modalInput);
						}).catch((err) => {
							uni.showModal({
								content: err.message || '修改失败，请重试',
								showCancel: false
							})
						}).finally(() => {
							uni.hideLoading()
						});
						break;
					default:
						// 电话
						db.collection("uni-id-users").where({
							username: this.userInfo.username
						}).update({
							mobile: this.modalInput
						}).then((res) => {
							uni.showToast({
								title: '修改成功'
							})
							this.$u.vuex('userInfo.mobile', this.modalInput);
						}).catch((err) => {
							uni.showModal({
								content: err.message || '修改失败，请重试',
								showCancel: false
							})
						}).finally(() => {
							uni.hideLoading()
						});
						break;
				}

			},
			// picker确认
			pickerConfirm(e) {
				uni.showLoading({
					title: '修改中...'
				})
				db.collection("uni-id-users").where({
					username: this.userInfo.username
				}).update({
					gender: e[0]
				}).then((res) => {
					uni.showToast({
						title: '修改成功'
					})
					this.$u.vuex('userInfo.gender', e[0]);
					uni.setStorage({key: 'userInfo',data: this.userInfo});
				}).catch((err) => {
					uni.showModal({
						content: err.message || '修改失败，请重试',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				});
			},
			// 改变头像
			changeAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {
						if (res.tempFilePaths.length > 0) {
							this.loading = true
							uni.showLoading({
								title: '头像修改中...'
							})
							console.log(res);
							let filePath = res.tempFilePaths[0]
							// callback方式，与promise方式二选一即可
							uniCloud.uploadFile({
								filePath: filePath,
								cloudPath: filePath.slice(-18),
								onUploadProgress: function(progressEvent) {
									console.log(progressEvent);
									var percentCompleted = Math.round(
										(progressEvent.loaded * 100) / progressEvent.total
									);
								},
								success:(res)=> {
									if(res.success){
										db.collection("uni-id-users").where({
											username: this.userInfo.username
										}).update({
											avatar: res.fileID
										}).then((result) => {
											console.log(result)
											uni.hideLoading()
											this.loading = false
											uni.showToast({
												title: '修改成功'
											})
											this.$u.vuex('userInfo.avatar', res.fileID);
											uni.setStorage({key: 'userInfo',data: this.userInfo});
										}).catch((err) => {
											uni.hideLoading()
											this.loading = false
											uni.showModal({
												content: err.message || '修改失败，请重试',
												showCancel: false
											})
										}).finally(() => {
											uni.hideLoading()
										});
									}else{
										uni.showToast({
											title: '图片上传失败'
										})
									}
								},
								fail() {},
								complete() {}
							});
						}
					}
				});
			},
			// 退出登录
			loginOut() {
				uni.showLoading({
					title: '退出中...'
				})
				setTimeout(() => {
					uni.hideLoading()
					this.$u.vuex('hasLogin', false);
					uni.reLaunch({
						url: '/pages/public/login'
					});
				}, 2000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.warp {
		.cell-avatar {
			/deep/ .u-cell__value {
				line-height: 0;
			}
		}

		.slot-content {
			padding: 20rpx 30rpx 30rpx;
		}

		.bottom-btn {
			position: fixed;
			width: calc(100vw - 40rpx);
			left: 20rpx;
			bottom: 20rpx;
		}
	}
</style>
