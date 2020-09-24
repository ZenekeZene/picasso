<template>
	<li class="tools__item"  v-if="mode === 'edit'"
		:class="{ '--disabled': isDisabled || mode === 'read' }"
	>
		<span class="icon-reply"
			v-touch:end="undo"
			v-mobile-hover:#4992a9
		></span>
		<span class="label">Undo</span>
	</li>
</template>

<script>
	import { mapState, mapGetters, mapMutations } from 'vuex';
	import PlayerDot from '../../mixins/PlayerDot.mixin';

	export default {
		name: 'UndoTool',
		mixins: [
			PlayerDot,
		],
		computed: {
			...mapState(['canvas', 'ctx']),
			...mapState('status', ['isPlaying', 'mode']),
			...mapState('strokes', ['history', 'indexLine']),
			...mapGetters('status', ['isDisabled']),
		},
		mounted() {
			document.addEventListener('keydown', (event) => {
				if (event.keyCode === 90 && (event.ctrlKey || event.metaKey)) {
					this.undo(event);
				}
			});
		},
		methods: {
			...mapMutations('strokes', ['removeStrokeOnHistory', 'decreaseIndexLine']),
			undo(event) {
				if (this.indexLine - 1 >= 0 && !this.isPlaying && !event.target.classList.contains('--disabled')) {
					this.removeStrokeOnHistory();
					this.decreaseIndexLine();
					this.$emit('clearCanvas');
					this.player(this.history);
				}
			},
		},
	};
</script>
