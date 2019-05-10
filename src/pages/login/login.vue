<template>
	<view class="content">
		<view class="login-bg">
			<view class="login-card">
				<view class="cu-form-group">
					<input type="number" placeholder="请输入您的手机号" v-model="mobile" />
				</view>
				<view class="cu-form-group">
					<input placeholder="请输入您获取的验证码" type="number" v-model="verificationCode" />
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

	import User from '@/store/models/user.js'
	export default {
		data() {
			return {
				mobile: undefined,
				verificationCode: undefined,
				verificationCodeTime: 60,
			}
		},
		methods: {
			async handelVerificationCodeTap() {
				if (!phonePattern.test(this.mobile) && this.verificationCodeTime === 60) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号',
					})
				} else {
					if (this.verificationCodeTime === 60) {
						const sendCode =
							`query {
								sendCode(mobile: "${this.mobile}") {
									code
									message
								}
							}`
						const res = await this.fetch(sendCode)
						uni.showToast({
							icon: 'none',
							title: res.data.data.sendCode.message || '验证码发送成功!',
						})
					}
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
			async handelSubmit() {
				if (!phonePattern.test(this.mobile) || !verificationCodePattern.test(this.verificationCode)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的信息',
					})
				} else {
					const loginQuery =
						`query Login {
							login(mobile: "${this.mobile}", code: "${this.verificationCode}") {
								result{
									user{
										id
										mobile
									}
									tokenInfo {
										accessToken
										expiresIn
									}
								}
							}
						}`
					const res = await this.fetch(loginQuery)
					const result = res.data.data.login.result
					await setUser({...result, cardInfo: {
						name: '侯真泓',
						department: 0,
						stuNum: 2018210022,
						stuId: 1673345,
					}})
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
