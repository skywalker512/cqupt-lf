<template>
	<view class="padding-top">
		<form @submit="handelFormSubmit">
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
				<picker @change="handelPickerChange" :value="index" :range="picker">
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
	</view>
</template>

<script>
	import { stuNumPattern } from '@/utils/pattern'
	export default {
		data() {
			return {
				index: 0,
				picker: ['通信与信息工程学院', '计算机科学与技术学院', '自动化学院'],
			}
		},
		methods: {
			handelPickerChange(e) {
				this.index = e.detail.value
			},
			async handelFormSubmit(e) {
				if (!stuNumPattern.test(e.detail.value.stuNum)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的学号',
					})
				}
			}
		}
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
