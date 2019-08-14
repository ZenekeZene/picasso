<template>
  <section class="p-paint">
	<ol
		class="tools --left"
		v-on="!isPlaying ? { mouseover } : {}"
		@mouseleave="toolsVisible = false"
		:class="{ '--disabled': isPainting }"
	>
		<colors-tool :toolsVisible="toolsVisible"></colors-tool>
		<stroke-tool :toolsVisible="toolsVisible"></stroke-tool>
		<replay-tool @replay="replay" @clearCanvas="clearCanvas"></replay-tool>
		<clean-tool @clearCanvas="clearCanvas"></clean-tool>
		<undo-tool @player="player" @clearCanvas="clearCanvas"></undo-tool>
		<download-tool :downloadURI="dataURI"></download-tool>
		<upload-tool></upload-tool>
	</ol>
	<canvas
		ref="canvas"
		width="1698"
		height="1028"
		class="p-paint__canvas"
		v-touch:start="handleMouseDown"
		v-touch:moving="handleMouseMove"
		v-touch:end="handleMouseUp"
	></canvas>
	<div class="button-bottom">
		<span
			class="icon-book"
			:class="{ '--disabled': isPlaying || isPainting }"
			@click="goToGallery"
			v-mobile-hover:#4992a9
		></span>
	</div>
	<div class="button-bottom --right">
		<span
			class="icon-write"
			:class="{ '--disabled': isPlaying || isPainting }"
			@click="goToPaint"
			v-mobile-hover:#4992a9
		></span>
	</div>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import CleanTool from './tools/CleanTool';
import UndoTool from './tools/UndoTool';
import ReplayTool from './tools/ReplayTool';
import DownloadTool from './tools/DownloadTool';
import UploadTool from './tools/UploadTool';
import ColorsTool from './tools/ColorsTool';
import StrokeTool from './tools/StrokeTool';

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
	},
	computed: {
		...mapState([
			'historyPersisted',
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
			return this.isPlaying || this.isPainting || this.historyPersisted.length === 0;
		},
	},
	data() {
		return {
			prevPosition: { offsetX: 0, offsetY: 0 },
			toolsVisible: false,
			dataURI: '',
			paintingId: null,
			raw: null,
			loopTimer: null,
		};
	},
	mounted() {
		this.setCanvas({
			canvas: this.$refs.canvas,
		});
		this.setContextCanvas({
			canvas: this.canvas,
		});
		//this.setBackgroundCanvas();
		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';
		this.ctx.lineWidth = this.strokeWidth;

		document.addEventListener('keydown', (event) => {
			if (event.keyCode === 90 && (event.ctrlKey || event.metaKey)) {
				this.undo(event);
			}
		});

		document.addEventListener('mouseout', (event) => {
			this.handleMouseUp(event);
		});

		if (this.historyPersisted.length > 0) {
			this.player();
		}

		this.paintingId = this.$route.params.id;

		if (this.paintingId) {
			window.db
				.collection('painting')
				.doc(this.paintingId)
				.get()
				.then((snapshot) => {
					this.setHistoryOfPainting({
						raw: snapshot.data().history
					});
					this.replay(4);
				});
			this.setModeToReadable();
		}
	},
	methods: {
		...mapMutations([
			'setHistoryPersisted',
			'pushDotOnHistory',
			'createNewStrokeOnHistory',
			'removeStrokeOnHistory',
			'deleteAllHistory',
			'incrementIndexLine',
			'decreaseIndexLine',
			'resetIndexLine',
			'setHistoryOfPainting',
			'setModeToReadable',
			'setContextCanvas',
			'setCanvas',
			'setPlayingStatus',
			'setPaintingStatus',
			'setModeToEditable',
		]),
		isToolEnabled(event) {
			return !event.target.classList.contains('--disabled');
		},
		goToGallery() {
			this.setHistoryPersisted({
				historyPersisted: this.historyPersisted,
			});
			this.$router.push('/gallery');
		},
		goToPaint() {
			this.setModeToEditable();
			this.deleteAllHistory();
			this.resetIndexLine();
			this.clearCanvas();
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
					offsetX = event.offsetX;
					offsetY = event.offsetY;
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
				dot: dot,
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
			for (let i = 0; i < this.historyPersisted.length; i += 1) {
				const stroke = this.historyPersisted[i];
				for (let j = 0; j < stroke.length; j += 1) {
					const dot = stroke[j];
					this.paintDot(dot);
				}
			}
		},
		saveToImage() {
			this.dataURI = this.canvas.toDataURL('png');
		},
		clearCanvas() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.setBackgroundCanvas();
		},
		setBackgroundCanvas() {
			this.ctx.fillStyle = this.colorErase;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		},
		replay(interval = 10) {
			if (!this.isPlaying) {
				if (this.historyPersisted.length > 0) {
					this.setPlayingStatus({
						status: true,
					});
					this.clearCanvas();
					const history = [].concat(...this.historyPersisted);
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
