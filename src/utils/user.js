import showError from '@/utils/showError'

export const getUser = () => {
	return new Promise(async (reslove, reject) => {
		const [error, res] = await uni.getStorage({key: 'user'})
		reslove(res)
	})
}

export const setUser = info => {
	return new Promise(async (reslove, reject) => {
		const [error, res] = await uni.setStorage({key: 'user', data: info})
		reslove(res)
	})
}
