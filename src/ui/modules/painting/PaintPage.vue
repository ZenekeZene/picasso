<template>
  <article class="p-paint">
		<transition name="fade" appear>
			<PaintingTools :class="{ '--disabled': isPainting || showSpinner }" />
		</transition>
		<transition name="fade" appear>
			<SpinnerItem v-show="showSpinner" />
		</transition>
		<CanvasItem
			class="p-paint__canvas"
			:class="{ '--blur': showSpinner }"
			@mouseup="handMouseUp"
		/>
		<transition name="fade" appear>
			<div class="button-floated --bottom --left"
				:class="{ '--disabled': isPainting }"
				v-mobile-hover:#4992a9
				@click.stop.prevent="goToGallery"
			>
				<span class="icon-book"></span>
				<span class="label">{{ $t('gallery.title') }}</span>
			</div>
		</transition>
		<transition name="fade" appear>
			<div class="button-floated --bottom --right"
				v-if="mode === 'read'"
				:class="{ '--disabled': isPainting }"
				v-mobile-hover:#4992a9
				@click.stop.prevent="launchRating"
			>
				<span class="label">{{ $t('painting.rating.cta') }}</span>
				<span class="icon-star-full"></span>
			</div>
		</transition>
		<UploadTool @showSpinner="showSpinner = $event.status" v-if="mode === 'edit' && history.length > 0" />
		<ModalPainting @showSpinner="showSpinner = $event.status" />
		<ModalRating @showSpinner="showSpinner = $event.status" />
  </article>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import PaintingTools from './tools/PaintingTools';
import CanvasItem from './CanvasItem';

export default {
	name: 'PaintPage',
	components: {
		PaintingTools,
		CanvasItem,
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
		};
	},
	mounted() {
		this.saveToImage();
	},
	methods: {
		...mapMutations(['clearCanvas']),
		...mapMutations('status', [
			'setModeToEditable',
			'setPlayingStatus',
			'setToolsVisible',
		]),
		...mapMutations('strokes', [
			'deleteAllHistory',
			'resetIndexLine',
		]),
		...mapMutations('gallery', ['setPaintingSelected']),
		isOptionEnabled(event) {
			return !event.target.classList.contains('--disabled');
		},
		goToGallery(event) {
			if (this.isOptionEnabled(event)) {
				this.setPlayingStatus({ status: false });
				this.$router.push({ name: 'gallery' });
			}
		},
		saveToImage() {
			this.dataURI = this.canvas.toDataURL('png');
		},
		launchRating(event) {
			if (this.isOptionEnabled(event)) {
				this.$modal.show('modal-rating');
			}
		},
		handMouseUp($event) {
			this.setToolsVisible({ toolsVisible: $event });
			this.saveToImage();
		},
	},
};
</script>
