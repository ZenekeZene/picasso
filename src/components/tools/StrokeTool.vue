<template>
	<li class="tools__item"
		:class="{ '--disabled': isPlaying || isPainting || mode === 'read' }"
		v-if="mode === 'edit'"
	>
		<span font-bold style="text-align: left;">{{ strokeWidthLocal }}</span>
		<span class="label" v-show="!toolsVisible">Size</span>
		<div class="range" v-show="toolsVisible">
		<input class="range__input" type="range" min="1" max="70" value="1"
			v-model="strokeWidthLocal"
			@change="changeStrokeWidth"
		/>
		<span
			class="range__label"
			:style="{
						minWidth: `${ strokeWidthLocal }px`,
						minHeight: `${ strokeWidthLocal }px`,
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
	data() {
		return {
			strokeWidthLocal: this.$store.state.strokeWidth,
		};
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
		changeStrokeWidth() {
			this.setStrokeWidth({ strokeWidth: this.strokeWidthLocal });
		},
	},
};
</script>
