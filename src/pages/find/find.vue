<template>
	<view class="padding-top">
		<view>
			<view class="cu-bar bg-white">
				<view class="action">
					拾到卡片
				</view>
			</view>
			<Ocr @ocrFininshed="handelOcrFininshed" v-if="!showCardInfo" />
			<view v-else>
				<view class="cu-form-group">
					<view class="title">姓名</view>
					<input placeholder="请输入您的姓名" name="name" v-model="cardInfo.name" />
				</view>
				<view class="cu-form-group">
					<view class="title">学号</view>
					<input placeholder="请输入您的学号" name="stuNum" type="number" v-model="cardInfo.stuNum" />
				</view>
				<view class="cu-form-group">
					<view class="title">统一认证码</view>
					<input placeholder="请输入您的学号" name="stuId" type="number" v-model="cardInfo.stuId" />
				</view>
				<view class="cu-form-group">
					<view class="title">学院</view>
					<picker @change="handelDepartmentPickerChange" :value="departmentIndex" :range="department" v-if="department.length !== 0">
						<view class="picker">
							{{department[departmentIndex]}}
						</view>
					</picker>
				</view>
				<view class="text-gray">请仔细检查上面自动填写的信息</view>
			</view>
		</view>
		<view class="cu-form-group margin-top" @tap="handelLocationTap">
			<view class="title">位置</view>
			<view class="picker">
				{{location}}
			</view>
		</view>
		<view class="text-gray">拾到卡片放入的位置</view>
		<view class="padding">
			<button class="cu-btn bg-blue lg" @tap="handelSubmit">提交</button>
		</view>
	</view>
</template>

<script>
	import Ocr from '@/component/ocr/ocr'
	import CardInfo from '@/component/cardInfo/cardInfo'
	import {
		address
	} from '@/utils/commonData'
	import Location from '@/store/models/location.js'
	export default {
		data() {
			return {
				imgList: [],
				departmentIndex: 0,
				department: [],
				cardInfo: {
					name: undefined,
					stuId: undefined,
					stuNum: undefined,
					department: {}
				},
				showCardInfo: false,
				location: '请点击以选择'
			};
		},
		async onLoad() {
			// #ifdef MP-ALIPAY
			this.showCardInfo = true
			// #endif
			// #ifdef H5
			this.showCardInfo = true
			// #endif
			// #ifdef APP-PLUS
			this.showCardInfo = true
			// #endif
			await this.fetchDepartmentData()
		},
		onShow() {
			const location = Location.query().first()
			if(location) {
				this.location = location.name
			}
		},
		components: {
			Ocr,
			CardInfo,
		},
		methods: {
			async handelLocationTap() {
				uni.navigateTo({
					url: '/pages/find/location'
				})
			},
			async handelOcrFininshed(e) {
				this.imgList = [...e]
				uni.showLoading({
					title: '加载中'
				})
				let base64
				base64 = wx.getFileSystemManager().readFileSync(this.imgList[0], "base64")
				const getOcrTokenRes = await this.fetch(`
					query {
						getOcrToken {
							accessToken
						}
					}
				`)			
				const [error, res] = await uni.request({
					url: `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${getOcrTokenRes.getOcrToken.accessToken}`,
					method: 'POST',
					data: {
						image: base64,
						detect_direction: true,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
				});
				res.data.words_result.forEach(item => {
					if (item.words.includes('学号')) this.cardInfo.stuNum = item.words.replace(/学号/, '').replace(
						/[^\u4e00-\u9fa5|[0-9]]*/, '').replace(/\//, '')
					if (item.words.includes('姓名')) this.cardInfo.name = item.words.replace(/姓名/, '').replace(
						/[^\u4e00-\u9fa5|[0-9]]*/, '').replace(/\//, '')
					if (item.words.includes('统一认证码')) this.cardInfo.stuId = item.words.replace(/统一认证码/, '').replace(
						/[^\u4e00-\u9fa5|[0-9]]*/, '').replace(/\//, '')
					if (item.words.includes('所属学院')) {
						const department = item.words.replace(/所属学院/, '').replace(/[^\u4e00-\u9fa5|[0-9]]*/, '').replace(/\//, '')
						this.department.forEach((depa, index) => {
							if (depa === department) this.departmentIndex = index
						})
					}
				})
				this.showCardInfo = true
				uni.hideLoading()
			},
			handelAddressPickerChange(e) {
				this.addressIndex = e.detail.value
			},
			handelDepartmentPickerChange(e) {
				this.departmentIndex = e.detail.value
			},
			async handelSubmit() {
				if (this.showCardInfo === false) {
					uni.showToast({
						icon: 'none',
						title: '请先填写信息',
					})
				} else if (this.location === '请点击以选择') {
					uni.showToast({
						icon: 'none',
						title: '请选择拾到位置',
					})
				} else {
					const departments = uni.getStorageSync('department')
					const departmentId = departments[this.departmentIndex].id
					const card = this.cardInfo
					const user = uni.getStorageSync('user')
					const creatCardRes = await this.fetch(
						`
						mutation {
							creatCard(
								stuNum: "${card.stuNum}",
								name:"${card.name}",
								departmentId:"${departmentId}",
								stuId: "${card.stuId}",
							) {
								code
								message
							}
						}
					`, {}, {
							ignoreError: true
						})
					const changeCardStatusRes = await this.fetch(
						`
						mutation {
							changeCardStatus(stuNum: "${card.stuNum}", status: "found", foundByUserId: "${user.user.id}", locationId: "${Location.query().first().id}") {
								code
								message
								card {
									status
									lostAt
									foundAt
								}
							}
						}
					`
					)
					uni.showToast({
						icon: 'none',
						title: '提交成功',
					})
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/index/index'
						})
					}, 1500)
					Location.deleteAll()
				}
			},
			async fetchDepartmentData() {
				let result = uni.getStorageSync('department')
				if (!result) {
					const quary =
						`
						query {
							findAllDepartments {
								departments {
									id
									name
								}
							}
						}
					`
					const res = await this.fetch(quary)
					result = res.findAllDepartments.departments
					uni.setStorageSync('department', result)
				}
				this.department = result.map(item => item.name)
			}
		}
	}
</script>

<style lang="less">
	image {
		width: 240upx;
		height: 200upx;
		margin: 0 0 20upx 0;
	}

	button {
		width: 100%;
	}

	.card-info {
		padding: 0 0 30upx 30upx;

		.stu-number {
			font-weight: bold;
			font-size: 32upx;
		}

		.stu-info {
			padding-top: 10upx;
		}
	}

	.text-gray {
		padding: 15upx 0 0 30upx;
	}
</style>
