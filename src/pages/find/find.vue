<template>
	<view class="padding-top">
		<form>
			<view v-if="imgList.length === 0">
				<view class="cu-bar bg-white">
					<view class="action">
						图像识别
					</view>
				</view>
				<view class="cu-form-group padding flex justify-center" @tap="handelChooseImage">
					<image src="../../static/svg/ocr.svg"></image>
				</view>
			</view>
			<view v-else>
				<view class="cu-bar bg-white">
					<view class="action">
						卡片信息
					</view>
				</view>
				<view class="bg-white card-info flex flex-direction">
					<view class="stu-number">2018210022</view>
					<view class="stu-info flex flex-direction">
						<text>姓名：侯真泓</text>
						<text>学院：通信与信息工程学院</text>
						<text>统一识别码：1673345</text>
					</view>
				</view>
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
	export default {
		data() {
			return {
				imgList: [],
				index: 0,
				picker: ['通信与信息工程学院', '计算机科学与技术学院', '自动化学院'],
			};
		},
		methods: {
			handelChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'], //从相册选择
					success: (res) => {
						this.imgList = [...res.tempFiles]
					}
				});
			},
			handelPickerChange(e) {
				console.log(this.index, e.detail.value)
				this.index = e.detail.value
			},
			async handelSubmit() {
				if(this.imgList.length === 0) {
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