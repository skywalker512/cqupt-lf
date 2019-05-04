<template>
	<view class="content">
		<view class="login-bg">
			<view class="login-card">
				<view class="cu-form-group">
					<input type="number" placeholder="请输入您的手机号" @blur="handelPhoneInput" />
				</view>
				<view class="cu-form-group">
					<input placeholder="请输入您获取的验证码" type="number" @blur="handelVerificationCodeInput" />
					<button class='cu-btn bg-green shadow' @tap="handelVerificationCodeTap" v-if="verificationCodeTime === 60">获取验证码</button>
					<button class='cu-btn bg-green shadow' v-else>还有 {{verificationCodeTime}} 秒</button>
				</view>
			</view>
		</view>
		<view class="login-btn">
			<view>
				<button class="cu-btn bg-blue lg" @tap="handelSubmit">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		phonePattern,
		verificationCodePattern
	} from '@/utils/pattern'
	import {
		setUser
	} from '@/utils/user'
	export default {
		data() {
			return {
				phoneNum: 0,
				verificationCode: 0,
				verificationCodeTime: 60,
			}
		},
		methods: {
			handelVerificationCodeTap() {
				if (!phonePattern.test(this.phoneNum)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号',
					})
				} else {
					if (this.verificationCodeTime === 0) {
						this.verificationCodeTime = 60
					} else {
						this.verificationCodeTime--
						setTimeout(() => {
							this.handelVerificationCodeTap()
						}, 1000)
					}
				}
			},
			handelPhoneInput(e) {
				this.phoneNum = e.detail.value
			},
			handelVerificationCodeInput(e) {
				this.verificationCode = e.detail.value
			},
			async handelSubmit() {
				if (!phonePattern.test(this.phoneNum) || !verificationCodePattern.test(this.verificationCode)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的信息',
					})
				} else {
					await setUser({
						userInfo: {
							phoneNum: 18523890371
						},
						cardInfo: {
							name: '侯真泓',
							department: 0,
							stuNum: 2018210022,
							stuId: 1673345,
						}
						// cardInfo: null,
					})
					uni.redirectTo({
						url: this.$mp.query.callback
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.login-btn {
		padding: 10upx 25upx;
		margin-top: 120upx;

		button {
			width: 100%;
		}
	}

	.login-bg {
		height: 260upx;
		padding: 25upx;
		background: linear-gradient(#3366ff, #15acc7);

		.login-card {
			background: #fff;
			border-radius: 12upx;
			padding: 10upx 25upx;
			box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
			position: relative;
			margin-top: 120upx;
		}
	}
</style>
