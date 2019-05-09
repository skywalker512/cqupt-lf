export default {
	fetch(query, pram = {}, url = 'http://localhost:3000/graphql', Methods = 'POST', CheckToken = false, ShowLoading = true, ShowMsg = true) {
		if (query) {
			pram.query = query
		}
		if (ShowLoading) {
			uni.showLoading({
				title: '请稍候...'
			})
		}
		if (CheckToken) {
			this.CheckToken()
			pram.token = store.state.$globalData.$userinfo.token;
		}
		// #ifdef MP-WEIXIN	
		pram.client_type = 'wx';
		// #endif
		// #ifdef APP-PLUS
		pram.client_type = 'app';
		// #endif
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				data: pram,
				method: Methods,
				success(res) {
					if (ShowLoading) {
						uni.hideLoading();
					}
					if (res.statusCode === 200 && !res.data.errors) {
						resolve(res)
					} else if (res.statusCode == 404) {
						if (ShowMsg) {
							uni.showToast({
								title: res.data.errors[0].extensions.exception.details || '访问的资源不存在',
								icon: 'none'
							})
						}
						reject(res)
					}
					else if (res.statusCode == 500) {
						if (ShowMsg) {
							uni.showToast({
								title: res.data.errors[0].extensions.exception.details || '服务器异常请稍后再试',
								icon: 'none'
							})
						}
						reject(res)
					} else {
						if (ShowMsg) {
							console.log(res.data.errors[0].extensions.exception.details)
							uni.showToast({
								title: res.data.errors[0].extensions.exception.details || '未知错误请稍后重试',
								icon: 'none'
							})
						}
						reject(res)
					}
				},
				fail(res) {
					if (ShowLoading) {
						uni.hideLoading();
					}
					if (ShowMsg) {
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