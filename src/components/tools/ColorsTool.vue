<template>
	<li class="tools__item">
		<span
			class="icon"
			:style="{ backgroundColor: colorStroke }"
			v-show="!toolsVisible"
			:class="{
				'--erase': colorStroke === colorErase,
				'--disabled': isPlaying || isPainting || mode === 'read'
			}"
		></span>
		<ol class="colors" v-show="toolsVisible">
			<li
				v-for="(color, index) in colors"
				:key="`color-${index}`"
				:style="{ backgroundColor: color }"
				@click="setColorStroke({ colorStroke: color })"
				:class="{ '--selected': colorStroke === color }"
			></li>
			<li
				:style="{ backgroundColor: colorErase }"
				@click="setColorStroke({ colorStroke: colorErase })"
				:class="{ '--selected': colorStroke === colorErase }"
				class="--erase"
			></li>
		</ol>
	</li>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	name: 'ColorsTool',
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
			'colorStroke',
			'colorErase',
		]),
	},
	data() {
		return {
			colors: [
				'#008f7a',
				'#845ec2',
				'#d65db1',
				'#ff6f91',
				'#ffc75f',
				'rgb(252, 222, 192)',
				'rgb(27, 37, 52)',
			],
		};
	},
	mounted() {
		this.setColorErase({
			colorErase: window
					.getComputedStyle(document.documentElement)
					.getPropertyValue('--color-background')
			}
		);
	},
	methods: {
		...mapMutations([
			'setColorStroke',
			'setColorErase',
		]),
	},
}
</script>