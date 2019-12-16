import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
import VModal from 'vue-js-modal';
import Toasted from 'vue-toasted';
import MobileHoverDirective from './directives/mobileHover.directive';
import App from './App';
import router from './router';
import store from './store';
import VueKonva from 'vue-konva';

import 'swiper/dist/css/swiper.css';
import './assets/styles/main.scss';

Vue.directive('mobile-hover', MobileHoverDirective);
Vue.use(Toasted, {
    theme: 'bubble',
    position: 'bottom-center',
    duration: 2000,
});
Vue.use(VModal);
Vue.use(Vue2TouchEvents);
Vue.use(VueKonva);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App),
});
