<template>
	<view class="padding-top">
		<view class="cu-bar bg-white">
			<view class="action">
				我的卡片
			</view>
		</view>
		<CardInfo :propsCardInfo="user.cardInfo" v-if="user.cardInfo" />
		<Ocr @ocrFininshed="handelOcrFininshed" v-else />
	</view>
</template>

<script>
	import {
		getUser
	} from '@/utils/user'
	import Ocr from '@/component/ocr/ocr'
	import CardInfo from '@/component/cardInfo/cardInfo'
	export default {
		data() {
			return {
				imgList: [],
				user: {},
			};
		},
		async onLoad() {
			this.user = await getUser()
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
