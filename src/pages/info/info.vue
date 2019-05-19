<template>
	<view class="padding-top">
		<view class="cu-bar bg-white">
			<view class="action">
				我的卡片
			</view>
		</view>
		<CardInfo :propsCardInfo="card" v-if="card" />
		<Ocr @ocrFininshed="handelOcrFininshed" v-else-if="!showCardInfo" />
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
			<view class="padding">
				<button class="cu-btn bg-blue lg" @tap="handelSubmit">提交</button>
			</view>
		</view>
		<view class="cu-btn bg-white text-blue font-weight-bold" @tap="handelButtonTap">退出登录</view>
	</view>
</template>

<script>
	import {
		getUser
	} from '@/utils/user'
	import Ocr from '@/component/ocr/ocr'
	import CardInfo from '@/component/cardInfo/cardInfo'
	import Card from '@/store/models/card'
	export default {
		data() {
			return {
				imgList: [],
				card: undefined,
				cardInfo: {
					name: undefined,
					stuId: undefined,
					stuNum: undefined,
					department: {}
				},
				showCardInfo: false,
				departmentIndex: 0,
				department: [],
			};
		},
		async onLoad() {
			// #ifdef MP-ALIPAY
			this.showCardInfo = true
			// #endif
			// #ifdef H5
			this.showCardInfo = true
			// #endif
			await this.fetchDepartmentData()
			const user = await getUser()
			const findOneCardRes = await this.fetch(
				`
				query {
					findOneCard(userId: "${user.user.id}") {
						code
						message
						card {
							stuId
							stuNum
							name
							department {
								name
								id
							}
						}
					}
				}
			`, {}, {
					ignoreError: true
				})
			if (findOneCardRes.findOneCard) {
				Card.create({
					data: { ...findOneCardRes.findOneCard.card,
						id: findOneCardRes.findOneCard.card.stuNum
					}
				})
				this.card = findOneCardRes.findOneCard.card
			}
		},
		components: {
			Ocr,
			CardInfo,
		},
		methods: {
			handelButtonTap() {
				uni.clearStorageSync()
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			async handelSubmit() {
				const {
					stuNum,
					name,
					stuId,
				} = this.cardInfo
				const departments = uni.getStorageSync('department')
				const departmentId = departments[this.departmentIndex].id
				const user = uni.getStorageSync('user')
				const mutation =
					`
					mutation {
						creatCard(
							stuNum: "${stuNum}", 
							userId:"${user.user.id}",
							name:"${name}",
							departmentId:"${departmentId}",
						) {
							code
							message
							card {
								name
								stuId
								createdAt
								updatedAt
								stuNum
								department {
									name
									id
								}
							}
						}
					}
				`
				const creatCardRes = await this.fetch(mutation)
				if (creatCardRes.creatCard) {
					Card.create({
						data: { ...creatCardRes.creatCard.card,
							id: creatCardRes.creatCard.card.stuNum
						}
					})
					this.card = creatCardRes.creatCard.card
				}
			},
			async handelOcrFininshed(e) {
				this.imgList = [...e]
				uni.showLoading({
					title: '加载中'
				})
				let base64
				base64 = wx.getFileSystemManager().readFileSync(this.imgList[0], "base64")
				const getOcrTokenRes = await this.fetch(
					`
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
		},
	}
</script>

<style lang="less">
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
	.cu-btn.bg-white {
		position: fixed;
		bottom: 0;
		height: 100upx;
		width: 100%;
		font-size: 30upx;
	}
	.cu-btn.bg-blue.lg {
		width: 100%;
	}
</style>
