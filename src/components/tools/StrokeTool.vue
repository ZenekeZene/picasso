<template>
	<li class="tools__item"
		:class="{ '--disabled': isPlaying || isPainting || mode === 'read' }"
		v-if="mode === 'edit'"
	>
		<span font-bold style="text-align: left;">{{ strokeWidth }}</span>
		<div class="range" v-show="toolsVisible">
		<input class="range__input" type="range" min="1" max="70" value="1" v-model="strokeWidth" />
		<span
			class="range__label"
			:style="{
						minWidth: `${ strokeWidth }px`,
						minHeight: `${ strokeWidth }px`,
						backgroundColor: colorStroke,
					}"
			:class="{ '--erase': colorStroke === colorErase }"
		></span>
		</div>
	</li>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
	name: 'StrokeTool',
	computed: {
		...mapState([
			'isPlaying',
			'isPainting',
			'mode',
			'colorStroke',
			'colorErase',
			'strokeWidth',
		]),
	},
	props: {
		toolsVisible: {
			default: false,
			type: Boolean,
		},
	},
	methods: {
		...mapMutations([
			'setStrokeWidth',
		]),
	},
	watch: {
		strokeWidth() {
			this.setStrokeWidth({ strokeWidth: this.strokeWidth });
		},
	},
};
</script>
