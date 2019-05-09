import Vue from 'vue'
import App from './App'
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import store from './store/store'
import fetch from '@/utils/fetch'

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
Vue.prototype.fetch = fetch.fetch

App.mpType = 'app'

const app = new Vue({
	...App,store
})
app.$mount()
