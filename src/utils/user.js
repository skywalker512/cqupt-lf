import showError from '@/utils/showError'

export const getUser = () => {
	return new Promise((reslove, reject) => {
		uni.getStorage({
			key: 'user',
			success(res) {
        reslove(res.data)
			},
			fail(e) {
				reslove(null)
			}
		})
	})
}

export const setUser = info => {
	return new Promise((reslove, reject) => {
		uni.setStorage({
			key: 'user',
			data: info,
			success(res) {
			  reslove(res)
			},
			fail(e) {
				showError(e)
			}
		})
	})
}
