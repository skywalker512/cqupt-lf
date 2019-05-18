<template>
	<view v-if="card">
		<view class="padding-top">
			<view class="cu-bar bg-white">
				<view class="action">
					我的卡片
				</view>
			</view>
			<CardInfo :propsCardInfo="card"/>
		</view>
		<view class="cu-timeline margin-top">
			<view class="cu-item text-green cuIcon-squarecheckfill">
				<view class="content bg-green shadow-blur">
					<text>填写信息</text>
				</view>
			</view>
			<view class="cu-item" :class="card.status.status==='found'?'text-green cuIcon-squarecheckfill':'text-blue cuIcon-timefill'">
				<view class="content shadow-blur" :class="card.status.status==='found'?'bg-green':'bg-blue'">
					<text>等待回复</text>
				</view>
			</view>
			<view class="cu-item" :class="card.status.status==='found'?'text-blue cuIcon-timefill':'text-grey'">
				<view class="content shadow-blur" :class="card.status.status==='found'?'bg-blue':'bg-grey'">
					<text v-if="card.status.status!=='found'">完成寻找</text>
					<text v-else>丢失地点: {{ card.status.foundLocation.name }}</text>
				</view>
			</view>
		</view>
		<view class="cu-btn bg-white text-blue font-weight-bold" @tap="handelReadyFoundButtonTap">已找到 / 已补办</view>
	</view>
</template>

<script>
	import Card from '@/store/models/card'
	import CardInfo from '@/component/cardInfo/cardInfo'
	export default {
		data() {
			return {
				card: undefined,
			};
		},
		components: {
			CardInfo,
		},
		async onLoad() {
			this.card = Card.find(this.$mp.query.stuNum)
		},
		methods: {
			async handelReadyFoundButtonTap() {
				const changeCardStatusRes = await this.fetch(`
					mutation {
						changeCardStatus(stuNum: "${this.$mp.query.stuNum}", status: "unknown") {
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
				if (changeCardStatusRes.changeCardStatus.card) {
					Card.update({
						id: this.$mp.query.stuNum,
						status: changeCardStatusRes.changeCardStatus.card,
					})
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}
			}
		},
	}
</script>

<style lang="less">
	.cu-btn.bg-white {
		position: fixed;
		bottom: 0;
		height: 100upx;
		width: 100%;
		font-size: 30upx;
	}
</style>
