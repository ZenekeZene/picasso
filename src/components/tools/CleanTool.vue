<template>
	<li class="tools__item" v-if="mode === 'edit'"
		:class="{ '--disabled': isDisabled || mode === 'read' }"
	>
		<span class="icon-trash"
			v-touch:end="clean"
			v-mobile-hover:#4992a9
		>
		</span>
		<span class="label">Clean</span>
	</li>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
	name: 'CleanTool',
	computed: {
		...mapState(['canvas', 'ctx']),
		...mapState('status', ['isPlaying', 'mode']),
		...mapGetters('status', ['isDisabled']),
	},
	methods: {
		...mapMutations('strokes', ['deleteAllHistory', 'resetIndexLine']),
		clean(event) {
			if (!this.isPlaying && !event.target.classList.contains('--disabled')) {
				this.deleteAllHistory();
				this.resetIndexLine();
				this.$emit('clearCanvas');
			}
		},
	},
};
</script>
