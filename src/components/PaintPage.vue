<template>
	<div class="paint">
		<ol class="paint__tools tools"
			@mouseover="toolsVisible = true"
			@mouseleave="toolsVisible = false"
		>
			<li class="tools__item">
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
						@click="strokeStyle = color; "
						:class="{ '--selected': strokeStyle === color }"
					></li>
					<li
						:style="{ backgroundColor: colorErase }"
						@click="strokeStyle = colorErase; "
						:class="{ '--selected': strokeStyle === colorErase }"
						class="--erase"
					></li>
				</ol>
			</li>
			<li class="tools__item">
				<span font-bold style="width: 2ch; text-align: left;">{{ strokeWidth }}</span>
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
			<li class="tools__item">
				<span class="icon-trash" @click="clean()"></span>
			</li>
			<li class="tools__item">
				<span class="icon-reply" @click="undo()"></span>
			</li>
			<li class="tools__item">
				<span class="icon-play" @click="replay()"></span>
			</li>
			<li class="tools__item">
				<a :href="dataURI" download><span class="icon-download"></span></a>
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
			@mousedown="handleMouseDown"
			@mousemove="handleMouseMove"
			@mouseup="handleMouseUp"
			v-touch:start="handleMouseDown"
			v-touch:moving="handleMouseMove"
			v-touch:end="handleMouseUp"
		></canvas>
	</div>
</template>

<script>
import { setTimeout } from 'timers';

export default {
	name: 'PaintPage',
	data() {
		return {
			canvas: null,
			ctx: null,
			prevPosition: { offsetX: 0, offsetY: 0 },
			isPainting: false,
			colors: [
				'rgb(255, 165, 0)',
				'rgb(80, 91, 222)',
				'rgb(252, 68, 72)',
				'rgb(50, 182, 183)',
				'rgb(134, 134, 134)',
				'rgb(252, 222, 192)',
				'rgb(27, 37, 52)',
			],
			colorErase: 'rgb(246,246,247)',
			backgroundColor: 'rgb(246,246,247)',
			strokeWidth: 1,
			strokeStyle: 'red',
			history: [],
			toolsVisible: false,
			currentIndex: 0,
			dataURI: '',
			pictures: [],
		};
	},
	mounted() {
		this.canvas = this.$refs.canvas;
		this.canvas.width = window.screen.width;
		this.canvas.height = window.screen.height;
		this.ctx = this.canvas.getContext('2d');
		this.setBackgroundCanvas();
		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';
		[this.strokeStyle] = this.colors;
		this.ctx.lineWidth = this.strokeWidth;

		let resizeTimer;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				this.canvas.width = window.screen.width;
				this.canvas.height = window.screen.height;
			}, 250);
		});
	},
	methods: {
		handleMouseDown(event) {
			const { offsetX, offsetY } = event;
			this.isPainting = true;
			this.prevPosition = { offsetX, offsetY };
			this.history.push([]);
		},
		handleMouseMove(event) {
			if (this.isPainting) {
				let offsetX;
				let offsetY;
				if (event.offsetX) {
					offsetX = event.offsetX;
					offsetY = event.offsetY;
				} else {
					offsetX = event.touches[0].pageX - event.touches[0].target.offsetLeft;
					offsetY = event.touches[0].pageY - event.touches[0].target.offsetTop;
				}
				const offSetData = { offsetX, offsetY };
				this.paint(offSetData);
			}
		},
		handleMouseUp() {
			if (this.isPainting) {
				this.isPainting = false;
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
		replay() {
			if (this.history.length > 0) {
				this.clearCanvas();
				const history = [].concat(...this.history);
				this.loop(0, history.length, (i) => {
					this.paintDot(history[i]);
				}, 100);
			}
		},
		loop(index, howManyTimes, f, ms) {
			let i = index;
			f(i);
			i += 1;
			if (i < howManyTimes) {
				setTimeout(() => {
					this.loop(i, howManyTimes, f);
				}, ms);
			}
		},
		undo() {
			if (this.currentIndex - 1 >= 0) {
				this.history.pop();
				this.currentIndex -= 1;
				this.clean();
				this.player();
			}
		},
		clean() {
			this.history = [];
			this.currentIndex = 0;
			this.clearCanvas();
		},
		clearCanvas() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.setBackgroundCanvas();
		},
		saveToImage() {
			this.dataURI = this.canvas.toDataURL('png');
		},
		setBackgroundCanvas(backgroundColor = this.backgroundColor) {
			this.ctx.fillStyle = backgroundColor;
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
