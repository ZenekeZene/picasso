<template>
  <div ref="paint" class="paint" tabindex=1 v-touch="handBlur">
	<ol
	  class="paint__tools tools"
	  v-on="!isPlaying ? { mouseover } : {}"
	  @mouseleave="toolsVisible = false"
	>
	  <li class="tools__item" :class="{ '--disabled': isPlaying }">
		<span
		  class="icon"
		  :style="{ backgroundColor: strokeStyle }"
		  v-show="!toolsVisible"
		  :class="{ '--erase': strokeStyle === colorErase }"
		></span>
		<ol class="colors" v-show="toolsVisible">
		  <li
			v-for="(color, index) in colors"
			:key="`color-${index}`"
			:style="{ backgroundColor: color }"
			@click.prevent="strokeStyle = color; "
			:class="{ '--selected': strokeStyle === color }"
		  ></li>
		  <li
			:style="{ backgroundColor: colorErase }"
			@click.prevent="strokeStyle = colorErase; "
			:class="{ '--selected': strokeStyle === colorErase }"
			class="--erase"
		  ></li>
		</ol>
	  </li>
	  <li class="tools__item" :class="{ '--disabled': isPlaying }">
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
	  <li class="tools__item" v-touch:end="addText">
		  <span class="icon-type"></span>
		  <span class="label">Text</span>
	  </li>
	  <li class="tools__item" :class="{ '--disabled': isPlaying }" v-touch:end="clean">
		<span class="icon-trash"></span>
		<span class="label">Clear Canvas</span>
	  </li>
	  <li class="tools__item" :class="{ '--disabled': isPlaying }" v-touch:end="undo">
		<span class="icon-reply"></span>
		<span class="label">Undo</span>
	  </li>
	  <li class="tools__item" :class="{ '--playing': isPlaying }" v-touch:end="replay">
		<span :class="{ 'icon-stop': isPlaying, 'icon-play': !isPlaying }"></span>
		<span class="label" v-if="!isPlaying">Replay</span>
		<span class="label" v-else>Stop</span>
	  </li>
	  <li class="tools__item" :class="{ '--disabled': isPlaying }">
		<a :href="dataURI" download="my-awesome-drawing-of-painter" v-show="!isPlaying">
		  <span class="icon-download"></span>
		</a>
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
	<!--<div class="draggable" v-touch:longtap="editText" contentEditable="true">Texto</div>-->

	<!--<div
	  data-x="0"
	  data-y="0"
	  class="resize-drag"
	  ref="square"
	  contenteditable="true"
	  v-touch:end="handSelection"
	>
	  <div class="resize-top resize-left"></div>
	  <p>Texto</p>
	  <div class="resize-bottom resize-right"></div>
	</div>-->
  </div>
</template>

<script>
import interact from 'interactjs';
import { setTimeout } from 'timers';
import { log } from 'util';
import TextInput from './TextInput.vue';
import Vue from 'vue';
const TextInputClass = Vue.extend(TextInput);

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
			colorErase: 'rgb(246,246,247)',
			backgroundColor: 'rgb(246,246,247)',
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
		this.setBackgroundCanvas();
		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';
		[this.strokeStyle] = this.colors;
		this.ctx.lineWidth = this.strokeWidth;

		document.addEventListener('keydown', (event) => {
			if (event.keyCode == 90 && (event.ctrlKey || event.metaKey)) {
				this.undo(event);
			}
		});

		document.addEventListener('mouseout', (event) => {
			this.handleMouseUp(event);
		});

		const position = { x: 0, y: 0 };

		interact('.draggable').draggable({
			listeners: {
				start(event) {
					console.log(event.type, event.target);
				},
				move(event) {
					position.x += event.dx;
					position.y += event.dy;

					event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
				},
			},
		});

		window.dragMoveListener = (event) => {
			var target = event.target;
			// keep the dragged position in the data-x/data-y attributes
			var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
			var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

			// translate the element
			target.style.webkitTransform = target.style.transform =
				'translate(' + x + 'px, ' + y + 'px)';

			// update the posiion attributes
			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);
		};

		interact('.resize-drag')
			.draggable({
				onmove: window.dragMoveListener,
				modifiers: [
					interact.modifiers.restrictRect({
						restriction: 'parent',
					}),
				],
			})
			.resizable({
				// resize from all edges and corners
				edges: { left: true, right: true, bottom: true, top: true },

				modifiers: [
					// keep the edges inside the parent
					interact.modifiers.restrictEdges({
						outer: 'parent',
						endOnly: true,
					}),
				],

				inertia: true,
			})
			.on('resizemove', (event) => {
				let target = event.target;
				let x = parseFloat(target.getAttribute('data-x')) || 0;
				let y = parseFloat(target.getAttribute('data-y')) || 0;

				// update the element's style
				target.style.width = event.rect.width + 'px';
				target.style.height = event.rect.height + 'px';
				target.style.fontSize = event.rect.width / 10 + 'px';

				// translate when resizing from top or left edges
				x += event.deltaRect.left;
				y += event.deltaRect.top;

				target.style.webkitTransform = target.style.transform =
					'translate(' + x + 'px,' + y + 'px)';

				target.setAttribute('data-x', x);
				target.setAttribute('data-y', y);
			});

		let angle = 0;

		interact('.paint').gesturable({
			onmove: (event) => {
				var arrow = this.$refs.square;

				angle += event.da;

				arrow.style.webkitTransform = arrow.style.transform =
					'rotate(' + angle + 'deg)';
			},
		});
	},
	methods: {
		handBlur() {
			console.log('handBlur');
			this.$el.focus();
		},
		getSelectionText() {
			let text = '';
			let sel;
			if (window.getSelection) {
				sel = window.getSelection();
				text = sel.toString();
			} else if (
				document.selection &&
				document.selection.type != 'Control'
			) {
				text = document.selection.createRange().text;
			}
			return { sel, text };
		},
		handSelection(event) {
			console.log(document.activeElement);
			let { sel, text } = this.getSelectionText();
			if (sel.rangeCount && sel.getRangeAt) {
				text = sel.getRangeAt(0);
			}
			// Set design mode to on
			document.designMode = 'on';
			if (text) {
				sel.removeAllRanges();
				sel.addRange(text);
			}
			// Colorize text
			document.execCommand('ForeColor', false, 'red');
			// Set design mode to off
			document.designMode = 'off';
		},
		mouseover(event) {
			event.preventDefault();
			this.toolsVisible = true;
		},
		handleMouseDown(event) {
			this.toolsVisible = false;
			const { offsetX, offsetY } = event;
			this.isPainting = true;
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
			event.preventDefault();
			if (this.isPainting && !this.isPlaying) {
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
		replay(event) {
			if (!this.isPlaying) {
				event.preventDefault();
				if (this.history.length > 0) {
					this.isPlaying = true;
					this.clearCanvas();
					const history = [].concat(...this.history);
					this.loop(
						0,
						history.length,
						(i) => {
							this.paintDot(history[i]);
						},
						() => {
							this.isPlaying = false;
						},
						100
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
		editText(event) {
			event.target.contentEditable = true;
			event.target.focus();
		},
		addText() {

			const instance = new TextInputClass({});
			console.log(instance);
			instance.$mount();
			this.$refs.paint.appendChild(instance.$el);
			setTimeout(() => {
				instance.$el.focus();
			}, 100);
		},
	},
};
</script>
