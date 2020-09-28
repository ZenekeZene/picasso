import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import SpinnerItem from '@/ui/components/SpinnerItem';
import ModalPainting from '@/ui/components/modals/ModalPainting';
import ModalRating from '@/ui/components/modals/ModalRating';

const requireComponent = require.context(
  './ui/components/tools',
  false,
  /[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )

  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

Vue.component('ModalRating', ModalRating);
Vue.component('ModalPainting', ModalPainting);
Vue.component('SpinnerItem', SpinnerItem);