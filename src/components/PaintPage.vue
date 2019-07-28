<template>
	<section class="paint">
		<ol class="tools --left"
			v-on="!isPlaying ? { mouseover } : {}"
			@mouseleave="toolsVisible = false"
			:class="{ '--disabled': isPainting }"
		>
			<li class="tools__item" :class="{ '--disabled': isPlaying || isPainting }">
				<span class="icon"
					:style="{ backgroundColor: strokeStyle }"
					v-show="!toolsVisible"
					:class="{ '--erase': strokeStyle === colorErase }"
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
			<li class="tools__item" :class="{ '--disabled': isPlaying || isPainting }">
				<span font-bold style="text-align: left;">{{ strokeWidth }}</span>
				<div class="range" v-show="toolsVisible">
					<input class="range__input" type="range" min="1" max="70" value="1" v-model="strokeWidth">
					<span class="range__label" :style="{
						minWidth: `${strokeWidth}px`,
						minHeight: `${strokeWidth}px`,
						backgroundColor: strokeStyle,
					}"
					:class="{ '--erase': strokeStyle === colorErase }"
					></span>
				</div>
			</li>
			<li class="tools__item" :class="{ '--disabled': isPlaying || isPainting }">
				<span class="icon-trash" v-touch:end="clean"></span>
				<span class="label">Clear Canvas</span>
			</li>
			<li class="tools__item" :class="{ '--disabled': isPlaying || isPainting }">
				<span class="icon-reply" v-touch:end="undo"></span>
				<span class="label">Undo</span>
			</li>
			<li class="tools__item" :class="{ '--playing': isPlaying, '--disabled': isPainting }">
				<span :class="{ 'icon-stop': isPlaying, 'icon-play': !isPlaying }" v-touch:end="replay"></span>
				<span class="label" v-if="!isPlaying">Replay</span>
				<span class="label" v-else>Stop</span>
			</li>
			<li class="tools__item" :class="{ '--disabled': isPlaying || isPainting }">
				<a :href="dataURI"
					download="my-awesome-drawing-of-painter"
					v-show="!isPlaying"
				><span class="icon-download"></span></a>
				<span class="label">Download</span>
			</li>
			<!--<li class="tools__item">
				<button @click="save()">Save</button>
			</li>
			<li class="tools__item">
				<button @click="load()">Load</button>
			</li>-->
		</ol>
		<canvas
			ref="canvas"
			width="1698"
			height="1028"
			class="paint__canvas"
			v-touch:start="handleMouseDown"
			v-touch:moving="handleMouseMove"
			v-touch:end="handleMouseUp"
		></canvas>
		<span class="button-bottom icon-users"
			:class="{ '--disabled': isPlaying || isPainting }"
			@click="$router.push('crud')"
		></span>
	</section>
</template>

<script>

export default {
	name: 'PaintPage',
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
			history: [],
			toolsVisible: false,
			currentIndex: 0,
			dataURI: '',
			loopTimer: null,
		};
	},
	mounted() {
		this.canvas = this.$refs.canvas;
		this.canvas.width = window.screen.width;
		this.canvas.height = window.screen.height;
		this.ctx = this.canvas.getContext('2d');
		this.colorErase = this.backgroundColor = window.getComputedStyle(document.documentElement)
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
	},
	methods: {
		mouseover(event) {
			event.preventDefault();
			this.toolsVisible = true;
		},
		handleMouseDown(event) {
			this.toolsVisible = false;
			const { offsetX, offsetY } = event;
			this.isPainting = true;
			this.$emit('isPainting', true);
			this.prevPosition = { offsetX, offsetY };
			this.history.push([]);
		},
		handleMouseMove(event) {
			if (this.isPainting && !this.isPlaying) {
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
			if (this.isPainting && !this.isPlaying) {
				this.isPainting = false;
				this.$emit('isPainting', false);
				this.currentIndex += 1;
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
			this.history[this.currentIndex].push(dot);
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
		replay(event) {
			if (!this.isPlaying) {
				event.preventDefault();
				if (this.history.length > 0) {
					this.isPlaying = true;
					this.clearCanvas();
					const history = [].concat(...this.history);
					this.loop(0, history.length, (i) => {
						this.paintDot(history[i]);
					}, () => {
						this.isPlaying = false;
					}, 100);
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
					this.loop(i, howManyTimes, f, callback);
				}, ms);
			} else {
				callback();
			}
		},
		undo(event) {
			event.preventDefault();
			if (this.currentIndex - 1 >= 0 && !this.isPlaying) {
				this.history.pop();
				this.currentIndex -= 1;
				this.clearCanvas();
				this.player();
			}
		},
		clean(event) {
			event.preventDefault();
			if (!this.isPlaying) {
				this.history = [];
				this.currentIndex = 0;
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
		save() {
			const history = [];
			for (let i = 0; i < this.history.length; i += 1) {
				const stroke = this.history[i];
				history[i] = [];
				for (let j = 0; j < stroke.length; j += 1) {
					const dot = stroke[j];
					history[i][j] = dot;
				}
				history[i] = JSON.stringify(history[i]);
			}
			localStorage.setItem('dibujo1', history);
		},
		load() {
			const history = localStorage.getItem('dibujo1');
			this.history = JSON.parse(`[${history}']`);
			this.replay();
		},
	},
};
</script>
