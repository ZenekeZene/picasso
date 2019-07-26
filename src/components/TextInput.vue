<template>
	<p contenteditable="true" class="text draggable" :style="{ 'color': color }"
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
		};
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
		interact(this.$el).draggable({
			onstart: () => {
				if (!this.isFocused) {
					EventBus.$emit('anyIsMoving', true);
				}
			},
			onmove: (event) => {
				if (!this.isFocused) {
					drag.dragMoveHandler(event);
				}
			},
			onend: () => {
				EventBus.$emit('anyIsMoving', false);
			},
		});

		let angle = 0;

		interact(this.$el).gesturable({
			onmove: (event) => {
				let arrow = event.target;

				angle += event.da;

				arrow.style.webkitTransform = arrow.style.transform =
					'rotate(' + angle + 'deg)';
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
