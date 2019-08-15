<template>
  <section class="p-paint">
	<ol
		class="tools --left"
		v-on="!isPlaying ? { mouseover } : {}"
		@mouseleave="toolsVisible = false"
		:class="{ '--disabled': isPainting || showSpinner }"
	>
		<colors-tool :toolsVisible="toolsVisible"></colors-tool>
		<stroke-tool :toolsVisible="toolsVisible"></stroke-tool>
		<replay-tool @replay="replay" @clearCanvas="clearCanvas"></replay-tool>
		<clean-tool @clearCanvas="clearCanvas"></clean-tool>
		<undo-tool @player="player" @clearCanvas="clearCanvas"></undo-tool>
		<!--<download-tool :downloadURI="dataURI"></download-tool>-->
		<upload-tool @showSpinner="showSpinner = $event.status"></upload-tool>
	</ol>
	<spinner-item v-show="showSpinner"></spinner-item>
	<canvas
		ref="canvas"
		width="1698"
		height="1028"
		class="p-paint__canvas"
		:class="{ '--blur': showSpinner }"
		v-touch:start="handleMouseDown"
		v-touch:moving="handleMouseMove"
		v-touch:end="handleMouseUp"
	></canvas>
	<div class="button-floated --bottom --left"
		@click="goToGallery"
		:class="{ '--disabled': isPlaying || isPainting }"
		v-mobile-hover:#4992a9
	>
		<span
			class="icon-book"
		></span>
		<span class="label">Galería</span>
	</div>
	<div class="button-floated --bottom --right"
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
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import CleanTool from './tools/CleanTool';
import UndoTool from './tools/UndoTool';
import ReplayTool from './tools/ReplayTool';
import DownloadTool from './tools/DownloadTool';
import UploadTool from './tools/UploadTool';
import ColorsTool from './tools/ColorsTool';
import StrokeTool from './tools/StrokeTool';
import SpinnerItem from './SpinnerItem';

export default {
	name: 'PaintPage',
	components: {
		CleanTool,
		UndoTool,
		ReplayTool,
		DownloadTool,
		UploadTool,
		ColorsTool,
		StrokeTool,
		SpinnerItem,
	},
	computed: {
		...mapState([
			'history',
			'indexLine',
			'mode',
			'canvas',
			'ctx',
			'isPainting',
			'isPlaying',
			'colorStroke',
			'colorErase',
			'strokeWidth',
		]),
		isDisabled() {
			return this.isPlaying || this.isPainting || this.history.length === 0;
		},
	},
	data() {
		return {
			prevPosition: { offsetX: 0, offsetY: 0 },
			toolsVisible: false,
			dataURI: '',
			paintingId: null,
			loopTimer: null,
			showSpinner: false,
		};
	},
	mounted() {
		this.configureCanvas();

		document.addEventListener('mouseout', (event) => {
			this.handleMouseUp(event);
		});

		if (this.history.length > 0) {
			this.player();
		}

		this.paintingId = this.$route.params.id;

		if (this.paintingId) {
			this.showSpinner = true;
			this.setPaintingSelected({
				paintingSelected: this.paintingId,
			});
			this.getHistoryOfPainting({
				paintingId: this.paintingId,
			})
			.then(() => {
				this.showSpinner = false;
				this.replay(4);
				this.setModeToReadable();
			})
			.catch(() => {
				this.$toasted.show('Ha surgido un error!');
				this.showSpinner = false;
			});
		}

		if (this.mode === 'edit') {
			this.setPaintingSelected({
				paintingSelected: null,
			});
		}
	},
	methods: {
		...mapMutations([
			'pushDotOnHistory',
			'createNewStrokeOnHistory',
			'deleteAllHistory',
			'incrementIndexLine',
			'resetIndexLine',
			'setModeToReadable',
			'setCanvas',
			'setPlayingStatus',
			'setPaintingStatus',
			'setModeToEditable',
			'clearCanvas',
			'setBackgroundCanvas',
			'setPaintingSelected',
		]),
		...mapActions([
			'getHistoryOfPainting',
		]),
		configureCanvas() {
			this.setCanvas({
				canvas: this.$refs.canvas,
			});
			this.canvas.width = window.screen.width;
			this.canvas.height = window.screen.height;
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';
			this.ctx.lineWidth = this.strokeWidth;
			this.setBackgroundCanvas();
		},
		isToolEnabled(event) {
			return !event.target.classList.contains('--disabled');
		},
		goToGallery(event) {
			if (!event.target.classList.contains('--disabled')) {
				this.$router.push('/gallery');
			}
		},
		goToPaint(event) {
			if (!event.target.classList.contains('--disabled')) {
				this.setModeToEditable();
				this.deleteAllHistory();
				this.resetIndexLine();
				this.clearCanvas();
				this.setPaintingSelected({
					paintingSelected: null,
				});
			}
		},
		mouseover(event) {
			event.preventDefault();
			this.toolsVisible = true;
		},
		handleMouseDown(event) {
			if (this.mode === 'edit') {
				this.toolsVisible = false;
				const { offsetX, offsetY } = event;
				this.setPaintingStatus({
					status: true,
				});
				this.prevPosition = { offsetX, offsetY };
				this.createNewStrokeOnHistory();
			}
		},
		handleMouseMove(event) {
			if (this.isPainting && !this.isPlaying && this.mode === 'edit') {
				let offsetX;
				let offsetY;
				if (event.offsetX) {
					({ offsetX, offsetY } = event);
				} else {
					offsetX = event.touches[0].clientX;
					offsetY = event.touches[0].clientY;
				}
				const offSetData = { offsetX, offsetY };
				this.paint(offSetData);
			}
		},
		handleMouseUp() {
			if (this.isPainting && !this.isPlaying && this.mode === 'edit') {
				this.setPaintingStatus({
					status: false,
				});

				this.incrementIndexLine();
				this.saveToImage();
			}
		},
		paint(currentPosition) {
			const { offsetX, offsetY } = currentPosition;
			const { offsetX: x, offsetY: y } = this.prevPosition;
			const dot = {
				size: this.strokeWidth,
				color: this.colorStroke,
				mousex: x,
				mousey: y,
				pmousex: offsetX,
				pmousey: offsetY,
			};
			this.paintDot(dot);
			this.pushDotOnHistory({
				dot,
			});
		},
		paintDot(dot) {
			const x = dot.mousex;
			const y = dot.mousey;
			const offsetX = dot.pmousex;
			const offsetY = dot.pmousey;
			this.ctx.beginPath();
			this.ctx.lineWidth = dot.size;
			this.ctx.strokeStyle = dot.color;
			this.ctx.moveTo(x, y);
			this.ctx.lineTo(offsetX, offsetY);
			this.ctx.stroke();
			this.prevPosition = { offsetX, offsetY };
		},
		player() {
			for (let i = 0; i < this.history.length; i += 1) {
				const stroke = this.history[i];
				for (let j = 0; j < stroke.length; j += 1) {
					const dot = stroke[j];
					this.paintDot(dot);
				}
			}
		},
		saveToImage() {
			this.dataURI = this.canvas.toDataURL('png');
		},
		replay(interval = 10) {
			if (!this.isPlaying) {
				if (this.history.length > 0) {
					this.setPlayingStatus({
						status: true,
					});
					this.clearCanvas();
					const history = [].concat(...this.history);
					this.loop(
						0,
						history.length,
						(i) => {
							this.paintDot(history[i]);
						},
						() => {
							this.setPlayingStatus({
								status: false,
							});
						},
						interval
					);
				}
			} else {
				clearTimeout(this.loopTimer);
				this.setPlayingStatus({
					status: false,
				});
				this.player();
			}
		},
		loop(index, howManyTimes, f, callback, ms) {
			let i = index;
			f(i);
			i += 1;
			if (i < howManyTimes) {
				this.loopTimer = setTimeout(() => {
					this.loop(i, howManyTimes, f, callback, ms);
				}, ms);
			} else {
				callback();
			}
		},
	},
};
</script>
