<template>
  <article class="p-paint">
		<transition name="fade" appear>
			<ol
				class="tools --left"
				:class="{ '--disabled': isPainting || showSpinner }"
				@mouseleave="setToolsVisible({ toolsVisible: true })"
			>
				<ColorsTool
					:toolsVisible="toolsVisible"
					@click.native="setToolsVisible({ toolsVisible: true })"
				/>
				<StrokeTool
					:toolsVisible="toolsVisible"
					@click.native="setToolsVisible({ toolsVisible: true })"
				/>
				<BrushTool
					:toolsVisible="toolsVisible"
					@click.native="setToolsVisible({ toolsVisible: true })"
				/>
				<UndoTool @clearCanvas="clearCanvas" />
				<DownloadTool :downloadURI="dataURI" />
				<CleanTool @clearCanvas="clearCanvas" />
			</ol>
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
				<span class="label">Libro de firmas</span>
			</div>
		</transition>
		<transition name="fade" appear>
			<div class="button-floated --bottom --right"
				v-if="mode === 'read'"
				:class="{ '--disabled': isPainting }"
				v-mobile-hover:#4992a9
				@click.stop.prevent="launchRating"
			>
				<span class="label">Puntuar este dibujo</span>
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
import CanvasItem from '../CanvasItem';
import CleanTool from '../tools/CleanTool';
import UndoTool from '../tools/UndoTool';
import BrushTool from '../tools/BrushTool';
import DownloadTool from '../tools/DownloadTool';
import UploadTool from '../tools/UploadTool';
import ColorsTool from '../tools/ColorsTool';
import StrokeTool from '../tools/StrokeTool';
import SpinnerItem from '../SpinnerItem';
import ModalPainting from '../modals/ModalPainting';
import ModalRating from '../modals/ModalRating';

export default {
	name: 'PaintPage',
	components: {
		CanvasItem,
		CleanTool,
		UndoTool,
		DownloadTool,
		UploadTool,
		BrushTool,
		ColorsTool,
		StrokeTool,
		SpinnerItem,
		ModalPainting,
		ModalRating,
	},
	computed: {
		...mapState([
			'mode',
			'isPainting',
			'isPlaying',
			'canvas',
			'toolsVisible',
		]),
		...mapState('strokes', ['history']),
		...mapState('gallery', ['theme']),
	},
	data() {
		return {
			dataURI: '',
			showSpinner: false,
		};
	},
	mounted() {
		this.saveToImage();
	},
	methods: {
		...mapMutations([
			'setModeToEditable',
			'clearCanvas',
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
