import * as Sentry from '@sentry/browser';

export default (msg) => {
	uni.showToast({
		title: '出现了一些问题',
		mask: true,
		icon: 'none',
	})
	Sentry.captureException(new Error(msg))
}