<template>
	<div class="paint">
		<ol class="paint__tools tools"
			@mouseover="toolsVisible = true"
			@mouseleave="toolsVisible = false"
		>
			<li class="tools__item">
				<span class="icon" :style="{ backgroundColor: strokeStyle }"></span>
				<ol class="colors" v-show="toolsVisible">
					<li
						v-for="(color, index) in colors"
						:key="`color-${index}`"
						:style="{ backgroundColor: color }"
						@click="strokeStyle = color; "
						:class="{ '--selected': strokeStyle === color } "
					></li>
				</ol>
			</li>
			<li class="tools__item">
				<span font-bold style="width: 1rem;">{{ strokeWidth }}</span>
				<div class="range" v-show="toolsVisible">
					<input class="range__input" type="range" min="1" max="30" value="1" v-model="strokeWidth">
					<span class="range__label" :style="{
						minWidth: `${strokeWidth * 2 }px`,
						minHeight: `${strokeWidth * 2 }px`,
						backgroundColor: strokeStyle,
					}"></span>
				</div>
			</li>
			<li class="tools__item">
				<button @click="clean()">Borrar</button>
			</li>
			<li class="tools__item">
				<button @click="undo()">Undo</button>
			</li>
			<li class="tools__item">
				<button @click="replay()">Replay</button>
			</li>
		</ol>
		<canvas
			ref="canvas"
			width="1000"
			height="1000"
			class="paint__canvas"
			@mousedown="handleMouseDown"
			@mousemove="handleMouseMove"
			@mouseup="handleMouseUp"
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
				'#f12f22',
				'#aabb22',
				'#ccffdd',
			],
			strokeWidth: 1,
			strokeStyle: 'red',
			history: [],
			toolsVisible: false,
			currentIndex: 0,
		};
	},
	mounted() {
		this.canvas = this.$refs.canvas;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';
		[this.strokeStyle] = this.colors;
		this.ctx.lineWidth = this.strokeWidth;
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
				const { offsetX, offsetY } = event;
				const offSetData = { offsetX, offsetY };
				this.paint(offSetData);
			}
		},
		handleMouseUp() {
			if (this.isPainting) {
				this.isPainting = false;
				this.currentIndex += 1;
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
			const history = [].concat(...[], this.history);
			this.loop(0, history.length, (i) => {
				this.paintDot(history[i]);
			}, 100);
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
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		},
	},
};
</script>
