<template>
  <article class="p-paint">
	<transition name="fade" appear>
		<ol
			class="tools --left"
			v-on="!isPlaying ? { mouseover } : {}"
			@mouseleave="toolsVisible = false"
			:class="{ '--disabled': isPainting || showSpinner }"
		>
			<colors-tool :toolsVisible="toolsVisible"></colors-tool>
			<stroke-tool :toolsVisible="toolsVisible"></stroke-tool>
			<replay-tool @paintingRecovery="handPaintingRecovery" @showSpinner="showSpinner = $event.status" @clearCanvas="clearCanvas"></replay-tool>
			<clean-tool @clearCanvas="clearCanvas"></clean-tool>
			<undo-tool @clearCanvas="clearCanvas"></undo-tool>
			<download-tool :downloadURI="dataURI"></download-tool>
			<upload-tool @showSpinner="showSpinner = $event.status"></upload-tool>
		</ol>
	</transition>
	<transition name="fade" appear>
		<spinner-item v-show="showSpinner"></spinner-item>
	</transition>
	<canvas-item></canvas-item>
	<transition name="fade" appear>
		<div class="button-floated --bottom --left"
			@click.stop.prevent="goToGallery"
			:class="{ '--disabled': isPlaying || isPainting }"
			v-mobile-hover:#4992a9
		>
			<span
				class="icon-book"
			></span>
			<span class="label">Galería</span>
		</div>
	</transition>
	<transition name="fade" appear>
		<div class="button-floated --column --bottom --right">
			<div
				@click.stop.prevent="launchRating"
				:class="{ '--disabled': isPlaying || isPainting }"
				v-if="mode === 'read'"
				v-mobile-hover:#4992a9
			>
				<span class="label">Puntuar este dibujo</span>
				<span
					class="icon-star"
				></span>
			</div>
			<div
				v-if="mode === 'read'"
				@click="goToPaint"
				:class="{ '--disabled': isPlaying || isPainting }"
				v-mobile-hover:#4992a9
			>
				<span class="label">Crear nuevo dibujo</span>
				<span
					class="icon-write"
				></span>
			</div>
		</div>
	</transition>
	<modal-rating :rating="rating" @setRating="rating = $event"></modal-rating>
  </article>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import CanvasItem from './CanvasItem';
import CleanTool from './tools/CleanTool';
import UndoTool from './tools/UndoTool';
import ReplayTool from './tools/ReplayTool';
import DownloadTool from './tools/DownloadTool';
import UploadTool from './tools/UploadTool';
import ColorsTool from './tools/ColorsTool';
import StrokeTool from './tools/StrokeTool';
import SpinnerItem from './SpinnerItem';
import ModalRating from './modals/ModalRating';
import PlayerDot from './PlayerDot.mixin';

export default {
	name: 'PaintPage',
	components: {
		CanvasItem,
		CleanTool,
		UndoTool,
		ReplayTool,
		DownloadTool,
		UploadTool,
		ColorsTool,
		StrokeTool,
		SpinnerItem,
		ModalRating,
	},
	computed: {
		...mapState([
			'history',
			'mode',
			'isPainting',
			'isPlaying',
			'theme',
		]),
	},
	data() {
		return {
			toolsVisible: false,
			dataURI: '',
			showSpinner: false,
			rating: 0,
		};
	},
	/*mounted() {
		document.addEventListener('mouseout', (event) => {
			this.handleMouseUp(event);
		});
	},*/
	methods: {
		...mapMutations([
			'setModeToEditable',
			'deleteAllHistory',
			'resetIndexLine',
			'clearCanvas',
			'setPaintingSelected',
		]),
		handPaintingRecovery($event) {
			if ($event.painting.rating) {
				this.rating = $event.painting.rating;
			}
		},
		isOptionEnabled(event) {
			return !event.target.classList.contains('--disabled');
		},
		goToGallery(event) {
			if (this.isOptionEnabled(event)) {
				this.$router.push('/gallery');
			}
		},
		goToPaint(event) {
			if (this.isOptionEnabled(event)) {
				this.setModeToEditable();
				this.deleteAllHistory();
				this.resetIndexLine();
				this.clearCanvas();
				this.$router.push('/');
			}
		},
		mouseover(event) {
			event.preventDefault();
			this.toolsVisible = true;
		},
		saveToImage() {
			this.dataURI = this.canvas.toDataURL('png');
		},
		launchRating(event) {
			if (this.isOptionEnabled(event)) {
				this.$modal.show('modal-rating');
			}
		},
	},
};
</script>
