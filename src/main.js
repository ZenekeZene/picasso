import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Vue2TouchEvents from 'vue2-touch-events';
import VModal from 'vue-js-modal';
import Toasted from 'vue-toasted';
import MobileHoverDirective from './directives/mobileHover.directive';
import App from './App';
import router from './router';
import store from './store';

import 'swiper/dist/css/swiper.css';
import './assets/styles/main.scss';

Vue.directive('mobile-hover', MobileHoverDirective);
Vue.use(Toasted, {
    theme: 'bubble',
    position: 'bottom-center',
    duration: 2000,
});
Vue.use(VueI18n);
Vue.use(VModal);
Vue.use(Vue2TouchEvents);

Vue.config.productionTip = false;

import messages from './messages.js';

const i18n = new VueI18n({
    locale: 'es',
    messages,
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    i18n,
    router,
    store,
    render: (h) => h(App),
});
