<template>
	<view class="bg-white card-info flex flex-direction">
		<view class="stu-number">{{cardInfo.stuNum}}</view>
		<view class="stu-info flex flex-direction">
			<text>姓名：{{cardInfo.name}}</text>
			<text>学院：{{cardInfo.department.name}}</text>
			<text v-if="cardInfo.stuId">统一识别码：{{cardInfo.stuId}}</text>
		</view>
	</view>
</template>


<script>
	export default {
		props: ['propsCardInfo'],
		data() {
			return {
				cardInfo: this.propsCardInfo,
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
</style>
