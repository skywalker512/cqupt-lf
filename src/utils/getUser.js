import showError from '@/utils/showError'

export const getUser = () => {
	return new Promise(async (reslove, reject) => {
			const [error, res] = await uni.setStorage('globalUser')
			if (res !== undefined) reslove(res)
			else {
				showError(error.errMsg)
			}
	})
}
