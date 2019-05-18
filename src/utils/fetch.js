import { getUser } from '@/utils/user'

export default {
	fetch(query, pram = {}, option, url = 'http://localhost:3000/graphql', Methods = 'POST') {
		const normal = {
			CheckToken: false,
			ShowLoading: true,
			ShowMsg: true,
			ignoreError: false,
		}
		option = {
			...normal,
			...option,
		}
		if (query) {
			pram.query = query
		}
		if (option.ShowLoading) {
			uni.showLoading({
				title: '请稍候...'
			})
		}
		if (option.CheckToken) {
			this.CheckToken()
			pram.token = store.state.$globalData.$userinfo.token;
		}
		// #ifdef MP-WEIXIN	
		pram.clientType = 'wx';
		// #endif
		// #ifdef APP-PLUS
		pram.clientType = 'app';
		// #endif
		return new Promise(async (resolve, reject) => {
			const user = await getUser()
			const accessToken = user && user.tokenInfo.accessToken
			uni.request({
				url: url,
				data: pram,
				method: Methods,
				header: {
					authorization: `Bearer ${accessToken}`
				},
				success(res) {
					if (option.ShowLoading) {
						uni.hideLoading();
					}
					if ((res.statusCode === 200 && !res.data.errors) || option.ignoreError) {
						resolve(res.data.data)
					} else if (res.statusCode == 404) {
						if (option.ShowMsg) {
							uni.showToast({
								title: res.data.errors[0].extensions.exception.details || '访问的资源不存在',
								icon: 'none'
							})
						}
						reject(res)
					}
					else if (res.statusCode == 500) {
						if (option.ShowMsg) {
							uni.showToast({
								title: res.data.errors[0].extensions.exception.details || '服务器异常请稍后再试',
								icon: 'none'
							})
						}
						reject(res)
					} else {
						if (option.ShowMsg) {
							uni.showToast({
								title: res.data.errors[0].extensions.exception.details || res.data.errors[0].message || '未知错误请稍后重试',
								icon: 'none'
							})
						}
						reject(res)
					}
				},
				fail(res) {
					if (option.ShowLoading) {
						uni.hideLoading();
					}
					if (option.ShowMsg) {
						uni.showToast({
							title: '请求失败',
							icon: 'none'
						})
					}
					reject(res);
				}
			})
		})
	},
	/*
	* 检查token 是否登录
	*/
	CheckToken() {
		let token = store.state.$globalData.$userinfo.token;

		if (token == '' || token == undefined || token == null) {

			uni.showToast({
				title: '您还未登录',
				duration: 2000
			});

			// #ifdef APP-PLUS
			uni.navigateTo({
				url: '/pages/login/login'
			});
			// #endif

			// #ifdef MP-WEIXIN
			uni.reLaunch({
				url: '/pages/login/wxlogin'
			});
			// #endif
		}
	}
}