<template>
	<li class="tools__item" relative v-if="mode === 'edit'">
		<span
			class="icon"
			:style="{ backgroundColor: colorStroke }"
			v-show="!toolsVisible"
			:class="{
				'--erase': colorStroke === colorErase,
				'--disabled': isPlaying || isPainting || mode === 'read'
			}"
		></span>
		<span class="label" v-show="!toolsVisible">Color</span>
		<ol class="colors" v-show="toolsVisible">
			<li
				v-for="(color, index) in colors"
				:key="`color-${index}`"
				@click="setColorStroke({ colorStroke: color })"
				:class="{ '--selected': colorStroke === color }"
			>
				<span :style="{ backgroundColor: color }"></span>
			</li>
			<li
				@click="setColorStroke({ colorStroke: colorErase })"
			>
				<span :style="{ backgroundColor: colorErase }"
					:class="{ '--selected': colorStroke === colorErase }"
					class="--erase"
				></span>
			</li>
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
			'mode'
		]),
		...mapState('brush', [ 'colorStroke', 'colorErase' ]),
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
					.getPropertyValue('--color-background'),
			});
	},
	methods: {
		...mapMutations('brush', ['setColorStroke', 'setColorErase']),
	},
};
</script>
