<template>
	<view class="padding-top">
		<form @submit="handelFormSubmit" v-if="!card">
			<view class="cu-form-group">
				<view class="title">姓名</view>
				<input placeholder="请输入您的姓名" name="name" />
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">学号</view>
				<input placeholder="请输入您的学号" name="stuNum" type="number" />
			</view>
			<view class="text-gray">我们将用该信息作为您校园卡的唯一凭证</view>
			<view class="cu-form-group margin-top">
				<view class="title">学院</view>
				<picker @change="handelPickerChange" :value="index" :range="picker" v-if="picker">
					<view class="picker">
						{{picker[index]}}
					</view>
				</picker>
			</view>
			<view class="text-gray">请选择您的学院 我们将用该信息对您进行检验</view>
			<view class="padding">
				<button class="cu-btn bg-blue lg" form-type="submit">提交</button>
			</view>
		</form>
		<view v-else>
			<view class="cu-bar bg-white">
				<view class="action">
					我的卡片
				</view>
			</view>
			<CardInfo :propsCardInfo="card"/>
			<view class="padding">
				<button @tap="handelUserCardLostSubmit" class="cu-btn bg-blue lg">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		stuNumPattern
	} from '@/utils/pattern'
	import {
		getUser
	} from '@/utils/user'
	import Department from '@/store/models/user.js'
	import CardInfo from '@/component/cardInfo/cardInfo'
	import Card from '@/store/models/card'
	export default {
		data() {
			return {
				index: 0,
				picker: undefined,
				card: undefined,
			}
		},
		components: {
			CardInfo
		},
		async onLoad() {
			const user = uni.getStorageSync('user')
			const findOneCardRes = await this.fetch(`
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
			`, {}, {ignoreError: true})
			if (findOneCardRes.findOneCard) {
				Card.create({data: {...findOneCardRes.findOneCard.card, id: findOneCardRes.findOneCard.card.stuNum} })
				const findCardStatusRes = await this.fetch(`
					query {
						findCardStatus(userId: "${user.user.id}") {
							code
							message
							card {
								status
								lostAt
								foundAt
								foundLocation {
									id
									name
								}
							}
						}
					}
				`)
				Card.update({
					id: findOneCardRes.findOneCard.card.stuNum,
					status: findCardStatusRes.findCardStatus.card,
				})
				if (findCardStatusRes.findCardStatus.code !== 2003){
					uni.redirectTo({
						url: `/pages/card/card?stuNum=${findOneCardRes.findOneCard.card.stuNum}`
					})
				} else {
					this.card = findOneCardRes.findOneCard.card
				}
			} else {
				await this.fetchDepartmentData()
			}
		},
		methods: {
			handelPickerChange(e) {
				this.index = e.detail.value
			},
			async handelUserCardLostSubmit(e) {
				const changeCardStatusRes = await this.fetch(`
					mutation {
						changeCardStatus(stuNum: "${this.card.stuNum}", status: "lost") {
							code
							message
							card {
								status
								lostAt
								foundAt
							}
						}
					}
				`)
				Card.update({
					id: this.card.stuNum,
					status: changeCardStatusRes.changeCardStatus.card,
				})
				uni.redirectTo({
					url: `/pages/card/card?stuNum=${this.card.stuNum}`
				})
			},
			async handelFormSubmit(e) {
				if (!stuNumPattern.test(e.detail.value.stuNum)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的学号',
					})
				} else {
					const { stuNum, name } = e.detail.value
					const departments = uni.getStorageSync('department')
					const departmentId = departments[this.index].id
					const user  = uni.getStorageSync('user')
					const mutation = `
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
						Card.create({data: {...creatCardRes.creatCard.card, id: creatCardRes.creatCard.card.stuNum} })
						const findCardStatusRes = await this.fetch(`
							query {
								findCardStatus(userId: "${user.user.id}") {
									code
									message
									card {
										status
										lostAt
										foundAt
										foundLocation {
											id
											name
										}
									}
								}
							}
						`)
						Card.update({
							id: creatCardRes.creatCard.card.stuNum,
							status: findCardStatusRes.findCardStatus.card,
						})
						if (findCardStatusRes.findCardStatus.code !== 2003){
							uni.redirectTo({
								url: `/pages/card/card?stuNum=${creatCardRes.creatCard.card.stuNum}`
							})
						} else {
							const changeCardStatusRes = await this.fetch(`
								mutation {
									changeCardStatus(stuNum: "${creatCardRes.creatCard.card.stuNum}", status: "lost") {
										code
										message
										card {
											status
											lostAt
											foundAt
										}
									}
								}
							`)
							Card.update({
								id: creatCardRes.creatCard.card.stuNum,
								status: changeCardStatusRes.changeCardStatus.card,
							})
							uni.redirectTo({
								url: `/pages/card/card?stuNum=${creatCardRes.creatCard.card.stuNum}`
							})
						}
					}
				}
			},
			async fetchDepartmentData() {
				let result = uni.getStorageSync('department')
				if (!result) {
					const quary = `
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
				this.picker = result.map(item=>item.name)
			}
		},
	}
</script>

<style lang="less">
	button {
		width: 100%;
	}
	.text-gray {
		padding: 15upx 0 0 30upx;
	}
</style>
