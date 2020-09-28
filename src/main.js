import Vue from 'vue';

import components from './global.components';
import directives from './directives';
import vendor from './vendor';

import App from './App';
import router from './router';
import store from './store';
import i18n from './i18n';

import 'swiper/dist/css/swiper.css';
import './assets/styles/main.scss';

Vue.config.productionTip = false;

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: (h) => h(App),
});


vm.showError = (error) => {
  console.error(error);
  vm.$toasted.show(this.$t('error.general'));
}