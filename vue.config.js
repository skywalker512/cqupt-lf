const webpack = require('webpack')
module.exports = {
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
			}),
		]
	}
}
