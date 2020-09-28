import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import SpinnerItem from '@/ui/components/SpinnerItem';
import ModalPainting from '@/ui/components/modals/ModalPainting';
import ModalRating from '@/ui/components/modals/ModalRating';

Vue.component('ModalRating', ModalRating);
Vue.component('ModalPainting', ModalPainting);
Vue.component('SpinnerItem', SpinnerItem);