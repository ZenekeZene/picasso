<template>
  <article class="p-paint">
		<transition name="fade" appear>
			<PaintingTools
				:class="{ '--disabled': isPainting || showSpinner }"
				:dataURI="dataURI"
			/>
		</transition>
		<transition name="fade" appear>
			<SpinnerItem v-show="showSpinner" />
		</transition>
		<CanvasItem
			class="p-paint__canvas"
			:class="{ '--blur': showSpinner }"
			@mouseup="handlerMouseUp"
		/>
		<PaintingActions :class="{ '--disabled': isPainting }" />
		<UploadTool @showSpinner="showSpinner = $event.status" v-if="mode === 'edit' && history.length > 0" />
		<ModalPainting @showSpinner="showSpinner = $event.status" />
		<ModalRating @showSpinner="showSpinner = $event.status" />
  </article>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import PaintingTools from './tools/PaintingTools';
import CanvasItem from './CanvasItem';
import PaintingActions from './PaintingActions';
import UploadTool from './tools/UploadTool';

export default {
	name: 'PaintPage',
	components: {
		PaintingTools,
		CanvasItem,
		PaintingActions,
		UploadTool,
	},
	computed: {
		...mapState(['canvas']),
		...mapState('status', [
			'mode',
			'isPainting',
		]),
		...mapState('strokes', ['history']),
		...mapState('gallery', ['theme']),
	},
	data() {
		return {
			showSpinner: false,
			dataURI: '',
		};
	},
	mounted() {
		this.saveToImage();
	},
	methods: {
		...mapMutations(['clearCanvas']),
		...mapMutations('status', [
			'setModeToEditable',
			'setToolsVisible',
		]),
		...mapMutations('strokes', [
			'deleteAllHistory',
			'resetIndexLine',
		]),
		...mapMutations('gallery', ['setPaintingSelected']),
		handlerMouseUp($event) {
			this.setToolsVisible({ toolsVisible: $event });
			this.saveToImage();	
		},
		saveToImage() {
			this.dataURI = this.canvas.toDataURL('png');
		}
	},
};
</script>
