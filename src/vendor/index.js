import Vue from 'vue';

import Vue2TouchEvents from 'vue2-touch-events';
import VModal from 'vue-js-modal';
import Toasted from 'vue-toasted';

Vue.use(Toasted, {
  theme: 'bubble',
  position: 'bottom-center',
  duration: 2000,
});
Vue.use(VModal);
Vue.use(Vue2TouchEvents);
