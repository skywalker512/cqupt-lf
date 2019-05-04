<template>
	<view class="padding-top">
		<form>
			<view>
				<view class="cu-bar bg-white">
					<view class="action">
						拾到卡片
					</view>
				</view>
				<Ocr @ocrFininshed="handelOcrFininshed" v-if="imgList.length === 0" />
				<CardInfo :propsCardInfo="cardInfo" v-else />
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">位置</view>
				<picker @change="handelPickerChange" :value="index" :range="picker" mode="selector">
					<view class="picker">
						{{picker[index]}}
					</view>
				</picker>
			</view>
			<view class="text-gray">拾到卡片放入的位置</view>
			<view class="padding">
				<button class="cu-btn bg-blue lg" @tap="handelSubmit">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	import Ocr from '@/component/ocr/ocr'
	import CardInfo from '@/component/cardInfo/cardInfo'
	import {
		address
	} from '@/utils/commonData'
	export default {
		data() {
			return {
				imgList: [],
				index: 0,
				picker: address,
				cardInfo: {
					name: '侯真泓',
					department: 0,
					stuNum: 2018210022,
					stuId: 1673345,
				}
			};
		},
		components: {
			Ocr,
			CardInfo,
		},
		methods: {
			handelOcrFininshed(e) {
				this.imgList = [...e]
			},
			handelPickerChange(e) {
				this.index = e.detail.value
			},
			async handelSubmit() {
				if (this.imgList.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请先扫描校园卡',
					})
				}
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
