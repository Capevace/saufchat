import Vue from 'vue';

// If in production build, include Sentry
if (process.env.NODE_ENV === 'production') {
	require('@/services/sentry');
}

// v-tooltip doesn't come with types, so this is a workaround to still make it work
const VTooltip = require('v-tooltip');
Vue.use(VTooltip);

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import '@/assets/tailwind.css';

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
