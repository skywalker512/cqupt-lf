<template>
	<view class="padding-top">
		<view class="cu-bar bg-white">
			<view class="action">
				我的卡片
			</view>
		</view>
		<CardInfo :propsCardInfo="card" v-if="card" />
		<Ocr @ocrFininshed="handelOcrFininshed" v-else />
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
			};
		},
		async onLoad() {
			const user = await getUser()
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
			}
			this.card = findOneCardRes.findOneCard.card
		},
		components: {
			Ocr,
			CardInfo,
		},
		methods: {
			handelOcrFininshed(e) {
				this.imgList = [...e]
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
</style>
