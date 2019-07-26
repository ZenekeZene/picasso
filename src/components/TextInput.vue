<template>
	<p contenteditable="true" class="text draggable" :style="{
		'color': color,
		'transform': transformCalculated
	}"
	v-touch:longtap="longtap"
	:data-index="index"
	@focus="focus"
	@blur="blur"
	></p>
</template>
<script>
import interact from 'interactjs';
import { EventBus } from '../scripts/EventBus.js';
import drag from '../scripts/drag';

export default {
	name: 'TextInput',
	props: {
		color: {
			type: String,
			default: 'black',
		},
		index: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			isFocused: false,
			translate: {
				x: 0,
				y: 0,
			},
			rotate: 0,
			scale: 1,
		};
	},
	computed: {
		transformCalculated: function() {
			return `translate(${this.translate.x}px, ${this.translate.y}px) rotate(${this.rotate}deg) scale(${this.scale})`;
		},
	},
	methods: {
		longtap() {
			alert('longtap');
		},
		focus() {
			this.isFocused = true;
			EventBus.$emit('anyFocused', true);
		},
		blur() {
			this.isFocused = false;
			EventBus.$emit('anyFocused', false);
		},
	},
	mounted() {
		let angle = 0;
		interact(this.$el)
		.gesturable({
			onmove: (event) => {
				angle += event.da;
				this.rotate = angle;
				this.scale = event.scale;
			},
		})
		.draggable({
			onstart: () => {
				if (!this.isFocused) {
					EventBus.$emit('anyIsMoving', true);
				}
			},
			onmove: (event) => {
				if (!this.isFocused) {
					let target = event.target;
	
					let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
					let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

					// translate the element
					this.translate.x = x;
					this.translate.y = y;

					// update the position attributes
					target.setAttribute('data-x', x);
					target.setAttribute('data-y', y);
				}
			},
			onend: () => {
				EventBus.$emit('anyIsMoving', false);
			},
		});
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
};
</script>
