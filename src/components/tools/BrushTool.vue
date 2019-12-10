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
				:class="{ '--selected': brush.key === brusher.key }"
			>
				<span :class="`icon-${brusher.iconClassname}`" v-mobile-hover:#4992a9></span>
			</li>
		</ol>
	</li>
</template>
<script>
import brushesUI from '../../brushesUI';
import { mapState, mapMutations } from 'vuex';
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
			brushes: brushes,
		};
	},
	methods: {
		...mapMutations([
			'setBrush',
		]),
	},
}
</script>