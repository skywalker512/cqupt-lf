<template>
	<view class="nav-list">
		<view @tap="handleNavigatorTap(item)" hover-class="none" :class="`bg-${item.color}`" class="radius shadow-blur nav-navigator padding"
		 v-for="(item) in elements" :key="item.title">
			<view class="nav-info">
				<view class="nav-title">{{item.title}}</view>
				<view class="nav-decs">{{item.decs}}</view>
			</view>
			<image :src="`../../static/svg/${item.image}.svg`"></image>
		</view>
	</view>
</template>

<script>
	import {
		getUser
	} from '@/utils/user'
	export default {
		data() {
			return {
				elements: [{
						title: '我丢了卡',
						decs: '点击即可登记丢卡信息',
						url: 'lost/lost',
						image: '404',
						color: 'gradual-blue',
					},
					{
						title: '我拾到了卡',
						decs: '点击即可登记拾卡信息',
						url: 'find/index',
						image: '302',
						color: 'gradual-orange',
					},
					{
						title: '我的信息',
						decs: '点击即可查看个人信息',
						url: 'info/index',
						image: '200',
						color: 'gradual-purple',
					},
				],
			}
		},
		methods: {
			async handleNavigatorTap(item) {
				const url = `/pages/${item.url}`
				const userInfo = await getUser()
				if (!userInfo) {
					uni.navigateTo({
						url: `/pages/login/login?callback=${url}`
					})
				} else {
					uni.navigateTo({
						url
					})
				}
			}
		},
	}
</script>

<style lang="less">
	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0px 30upx 0px;
		justify-content: space-between;

		.nav-navigator {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			margin: 40upx 0;

			.nav-info {
				.nav-title {
					font-size: 40upx;
					line-height: 55upx;
				}

				.nav-decs {
					font-size: 28upx;
				}
			}

			image {
				width: 200upx;
				height: 160upx;
			}
		}
	}
</style>
