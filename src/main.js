// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
import VModal from 'vue-js-modal';
import Toasted from 'vue-toasted';

import App from './App';
import router from './router';

import 'swiper/dist/css/swiper.css'
import './assets/styles/main.scss';

Vue.directive('mobile-hover', {
	inserted: function(el, binding, vnode) {
		el.addEventListener('touchstart', (event) => {
			if (!el.parentNode.classList.contains('--disabled')) {
				el.style.color = binding.arg;
				if (binding.expression) {
					el.classList.add(binding.expression.replace(/'/g,''));
				}
				setTimeout(() => {
					event.target.style.color = 'unset';
					if (binding.expression) {
						el.classList.remove(
							binding.expression.replace(/'/g, '') 
						);
					}
				}, 250);
			}
		});
	},
});

Vue.use(Toasted, {
	theme: "bubble", 
	position: "bottom-center", 
	duration : 2000
});
Vue.use(VModal);
Vue.use(Vue2TouchEvents);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>',
});
