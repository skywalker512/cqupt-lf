<template>
	<view class="VerticalBox">
		<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:100vh">
			<view class="cu-item" :class="index==tabCur?'text-green cur':''" v-for="(item,index) in list" :key="item.id" @tap="TabSelect"
			 :data-id="index">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:100vh"
		 :scroll-into-view="'main-'+mainCur" @scroll="VerticalMain">
			<view class="padding-top padding-lr" v-for="(item,index) in list" :key="item.id" :id="'main-'+index">
				<view class="cu-bar solid-bottom bg-white">
					<view class="action">
						<text class="cuIcon-title text-green"></text>{{item.name}}</view>
				</view>
				<view class="cu-list menu">
					<view class="cu-item arrow" v-for="(subItem) in item.locations" :key="subItem.id" @tap="handelItemTap(subItem.id, subItem.name)">
						<button class="cu-btn content">
							<text class="text-grey">{{subItem.name}}</text>
						</button>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import Location from '@/store/models/location.js'
	export default {
		data() {
			return {
				list: [],
				subList: [],
				tabCur: 0,
				mainCur: 0,
				verticalNavTop: 0,
				load: true
			};
		},
		async onLoad() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			const findAllLocationWithTagsRes = await this.fetch(
				`
				query {
					findAllLocationWithTags {
						code
						message
						locationWithTags {
							id
							name
							locations {
								name
								id
							}
						}
					}
				}
			`
			)
			this.list = findAllLocationWithTagsRes.findAllLocationWithTags.locationWithTags
		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			handelItemTap(id, name) {
				Location.create({data: {id, name} })
				uni.navigateBack()
			},
			TabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.mainCur = e.currentTarget.dataset.id;
				this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50
			},
			VerticalMain(e) {
				// #ifdef MP-ALIPAY
				return false //支付宝小程序暂时不支持双向联动 
				// #endif
				let tabHeight = 0;
				if (this.load) {
					for (let i = 0; i < this.list.length; i++) {
						let view = uni.createSelectorQuery().select("#main-" + this.list[i].id);
						view.fields({
							size: true
						}, data => {
							this.list[i].top = tabHeight;
							tabHeight = tabHeight + data.height;
							this.list[i].bottom = tabHeight;
						}).exec();
					}
					this.load = false
				}
				let scrollTop = e.detail.scrollTop + 10;
				for (let i = 0; i < this.list.length; i++) {
					if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
						this.verticalNavTop = (this.list[i].id - 1) * 50
						this.tabCur = this.list[i].id
						console.log(scrollTop)
						return false
					}
				}
			}
		},
	}
</script>

<style lang="less">
	.fixed {
		position: fixed;
		z-index: 99;
	}

	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		background-color: #fff;
		margin: 0;
		border: none;
		height: 50px;
		position: relative;
	}

	.VerticalNav.nav .cu-item.cur {
		background-color: #f1f1f1;
	}

	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}

	.VerticalBox {
		display: flex;
	}

	.VerticalMain {
		background-color: #f1f1f1;
		flex: 1;
	}
</style>
