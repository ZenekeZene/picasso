<template>
	<li class="tools__item" v-if="mode === 'edit'">
		<span
			class="icon"
			v-show="!toolsVisible"
			:class="{
				'--disabled': isPlaying || isPainting || mode === 'read'
			}"
		></span>
		<ol class="colors --brushes" v-show="toolsVisible">
			<li
				v-for="(brusher, index) in brushes"
				:key="`brush-${index}`"
				@click="setBrush({ brush: brusher })"
			>
				<!--:class="{ '--selected': brush.key === brusher.key }"-->
				<span :class="`icon-${brusher.iconClassname}`" v-mobile-hover:#4992a9></span>
			</li>
		</ol>
	</li>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import brushesUI from '../../brushes/brushesUI';

export default {
	name: 'BrushTool',
	props: {
		toolsVisible: {
			default: false,
			type: Boolean,
		},
	},
	computed: {
		...mapState([
			'isPainting',
			'isPlaying',
			'mode',
			'brush',
		]),
	},
	data() {
		return {
			brushes: brushesUI,
		};
	},
	props: {
		toolsVisible: {
			default: false,
			type: Boolean,
		},
	},
	mounted() {
		this.brushes = brushesUI;
		console.log(this.brushes);
	},
	methods: {
		...mapMutations([
			'setBrush',
		]),
	},
}
</script>