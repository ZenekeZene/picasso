<template>
  <section class="p-paint">
	<ol
		class="tools --left"
		v-on="!isPlaying ? { mouseover } : {}"
		@mouseleave="toolsVisible = false"
		:class="{ '--disabled': isPainting }"
	>
		<li class="tools__item">
			<span
				class="icon"
				:style="{ backgroundColor: strokeStyle }"
				v-show="!toolsVisible"
				:class="{ '--erase': strokeStyle === colorErase, '--disabled': isPlaying || isPainting || mode === 'read' }"
			></span>
			<ol class="colors" v-show="toolsVisible">
				<li
					v-for="(color, index) in colors"
					:key="`color-${index}`"
					:style="{ backgroundColor: color }"
					@click="strokeStyle = color;"
					:class="{ '--selected': strokeStyle === color }"
				></li>
				<li
					:style="{ backgroundColor: colorErase }"
					@click="strokeStyle = colorErase;"
					:class="{ '--selected': strokeStyle === colorErase }"
					class="--erase"
				></li>
			</ol>
		</li>
		<li class="tools__item" :class="{ '--disabled': isPlaying || isPainting || mode === 'read' }">
			<span font-bold style="text-align: left;">{{ strokeWidth }}</span>
			<div class="range" v-show="toolsVisible">
			<input class="range__input" type="range" min="1" max="70" value="1" v-model="strokeWidth" />
			<span
				class="range__label"
				:style="{
							minWidth: `${strokeWidth}px`,
							minHeight: `${strokeWidth}px`,
							backgroundColor: strokeStyle,
						}"
				:class="{ '--erase': strokeStyle === colorErase }"
			></span>
			</div>
		</li>
		<li class="tools__item">
			<span class="icon-trash" v-touch:end="clean" v-mobile-hover:#4992a9 :class="{ '--disabled': isDisabled || mode === 'read' }"></span>
			<span class="label">Clear Canvas</span>
		</li>
		<li class="tools__item">
			<span class="icon-reply" v-touch:end="undo" v-mobile-hover:#4992a9 :class="{ '--disabled': isDisabled || mode === 'read' }"></span>
			<span class="label">Undo</span>
		</li>
		<li class="tools__item">
			<span
				:class="{ 'icon-stop': isPlaying, 'icon-play': !isPlaying , '--playing': isPlaying, '--disabled': isPauseDisabled }"
				v-touch:end="replay"
				v-mobile-hover:#4992a9
			></span>
			<span class="label" v-if="!isPlaying">Replay</span>
			<span class="label" v-else>Stop</span>
		</li>
		<li class="tools__item" :class="{ '--disabled': isDisabled }">
			<a :href="dataURI" download="my-awesome-drawing-of-painter">
			<span class="icon-printer"></span>
			</a>
			<span class="label">Download</span>
		</li>
		<li class="tools__item">
			<span class="icon-upload" @click="launchSave" v-mobile-hover:#4992a9 :class="{ '--disabled': isDisabled || mode === 'read' }"></span>
			<span class="label">Upload</span>
		</li>
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
	<modal-painting @sendPainting="save"></modal-painting>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ModalPainting from './ModalPainting';

export default {
	name: 'PaintPage',
	components: {
		ModalPainting,
	},
	computed: {
		...mapState([
			'historyPersisted',
			'indexLine',
			'mode',
		]),
		isDisabled() {
			return this.isPlaying || this.isPainting || this.historyPersisted.length === 0;
		},
		isPauseDisabled() {
			return this.isPainting || this.historyPersisted.length === 0;
		},
	},
	data() {
		return {
			canvas: null,
			ctx: null,
			prevPosition: { offsetX: 0, offsetY: 0 },
			isPainting: false,
			isPlaying: false,
			colors: [
				'#008F7A',
				'#845EC2',
				'#D65DB1',
				'#FF6F91',
				'#FFC75F',
				'rgb(252, 222, 192)',
				'rgb(27, 37, 52)',
			],
			colorErase: '',
			backgroundColor: '',
			strokeWidth: 10,
			strokeStyle: 'red',
			toolsVisible: false,
			dataURI: '',
			loopTimer: null,
			paintingId: null,
			raw: null,
		};
	},
	mounted() {
		this.canvas = this.$refs.canvas;
		this.canvas.width = window.screen.width;
		this.canvas.height = window.screen.height;
		this.ctx = this.canvas.getContext('2d');
		this.colorErase = this.backgroundColor = window
			.getComputedStyle(document.documentElement)
			.getPropertyValue('--color-background');
		this.setBackgroundCanvas();
		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';
		[this.strokeStyle] = this.colors;
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
		mouseover(event) {
			event.preventDefault();
			this.toolsVisible = true;
		},
		handleMouseDown(event) {
			if (this.mode === 'edit') {
				this.toolsVisible = false;
				const { offsetX, offsetY } = event;
				this.isPainting = true;
				this.$emit('isPainting', true);
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
			this.$emit('isPainting', false);
			if (this.isPainting && !this.isPlaying && this.mode === 'edit') {
				this.isPainting = false;
				this.$emit('isPainting', false);
				this.incrementIndexLine();
				this.saveToImage();
			}
		},
		paint(currentPosition) {
			const { offsetX, offsetY } = currentPosition;
			const { offsetX: x, offsetY: y } = this.prevPosition;
			const dot = {
				size: this.strokeWidth,
				color: this.strokeStyle,
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
		replay(interval = 100) {
			if (!this.isPlaying) {
				if (this.historyPersisted.length > 0) {
					this.isPlaying = true;
					this.clearCanvas();
					const history = [].concat(...this.historyPersisted);
					this.loop(
						0,
						history.length,
						(i) => {
							this.paintDot(history[i]);
						},
						() => {
							this.isPlaying = false;
						},
						interval
					);
				}
			} else {
				clearTimeout(this.loopTimer);
				this.isPlaying = false;
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
		undo(event) {
			if (this.currentIndex - 1 >= 0 && !this.isPlaying && this.isToolEnabled(event)) {
				this.removeStrokeOnHistory();
				this.decreaseIndexLine();
				this.clearCanvas();
				this.player();
			}
		},
		clean(event) {
			if (!this.isPlaying && this.isToolEnabled(event)) {
				this.deleteAllHistory();
				this.resetIndexLine();
				this.clearCanvas();
			}
		},
		clearCanvas() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.setBackgroundCanvas();
		},
		saveToImage() {
			this.dataURI = this.canvas.toDataURL('png');
		},
		setBackgroundCanvas() {
			this.ctx.fillStyle = this.backgroundColor;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		},
		launchSave(event) {
			if (this.isToolEnabled(event)) {
				this.$modal.show('modal-painting');
			}
		},
		save(paintingData) {
			this.getCanvasBlob().then((blob) => {
				var metadata = {
					'contentType': 'image/png'
				};
				window.storage.ref().child(`images/${Math.floor(Date.now() / 1000)}`).put(blob, metadata).then((snapshot) => {
					console.log('Uploaded', snapshot.totalBytes, 'bytes.');
					snapshot.ref.getDownloadURL().then((url) => {
						window.db
							.collection('painting')
							.add({
								name: paintingData.name,
								history: JSON.stringify(this.historyPersisted),
								url: url,
							})
							.then(() => {
								this.$toasted.show('Dibujo subido con éxito!');
							});
					});
				}).catch((error) => {
					console.error('Upload failed:', error);
				});
			});
		
			this.$modal.hide('modal-painting');
		},
		getCanvasBlob() {
			return new Promise((resolve, reject) => {
				this.canvas.toBlob((blob) => {
					resolve(blob);
				});
			});
		},
	},
};
</script>
