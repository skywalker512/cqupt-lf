import Vue from 'vue'
import App from './App'
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';


Sentry.init({
	dsn: SENTRY_DSN,
	integrations: [
		new Integrations.Vue({
			Vue,
			attachProps: true,
		}),
	],
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
