<template>
	<p contenteditable="true" class="text draggable"
	v-touch:longtap="longtap"></p>
</template>
<script>
import drag from '../scripts/drag';
import interact from 'interactjs';

export default {
	name: 'TextInput',
	methods: {
		longtap() {
			alert('longtap');
		},
	},
	mounted() {
		interact(this.$el).draggable({
			onmove: drag.dragMoveHandler,
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
