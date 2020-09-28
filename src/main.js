import Vue from 'vue';

import App from './App';
import vendor from './vendor';
import { router, store } from '@/adapter';
import { i18n } from '@/ui';
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