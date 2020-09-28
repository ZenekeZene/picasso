import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import SpinnerItem from '@/components/SpinnerItem';
import ModalPainting from '@/components/modals/ModalPainting';
import ModalRating from '@/components/modals/ModalRating';
import CanvasItem from '@/components/CanvasItem';

const requireComponent = require.context(
  './components/tools',
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

Vue.component('CanvasItem', CanvasItem);
Vue.component('ModalRating', ModalRating);
Vue.component('ModalPainting', ModalPainting);
Vue.component('SpinnerItem', SpinnerItem);