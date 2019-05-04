<template>
	<view>
		<view class="cu-form-group padding flex justify-center" @tap="handelChooseImage">
			<image src="../../static/svg/ocr.svg"></image>
		</view>
	</view>
</template>


<script>
	export default {
		methods: {
			async handelChooseImage() {
				const [err, res] = await uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'], //从相册选择
				})
				if (!err) {
					this.$emit('ocrFininshed', res.tempFiles)
				} else {
					uni.showToast({
						icon: 'none',
						title: '图像识别出错',
					})
				}
			},
		}
	}
</script>


<style lang="less">
	image {
		width: 240upx;
		height: 200upx;
		margin: 0 0 20upx 0;
	}
</style>
