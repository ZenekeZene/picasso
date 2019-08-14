<template>
	<li class="tools__item"  v-if="mode === 'edit'">
		<span class="icon-reply"
			v-touch:end="undo"
			v-mobile-hover:#4992a9
			:class="{ '--disabled': isDisabled || mode === 'read' }"
		></span>
		<span class="label">Undo</span>
	</li>
</template>

<script>
	import { mapState, mapGetters, mapMutations, } from 'vuex';
	export default {
		name: 'UndoTool',
		computed: {
			...mapState([
				'isPlaying',
				'mode',
				'indexLine',
				'canvas',
				'ctx',
			]),
			...mapGetters([
				'isDisabled',
			]),
		},
		methods: {
			...mapMutations([
				'removeStrokeOnHistory',
				'decreaseIndexLine',
			]),
			undo(event) {
				if (this.indexLine - 1 >= 0 && !this.isPlaying) {
					this.removeStrokeOnHistory();
					this.decreaseIndexLine();
					this.$emit('clearCanvas');
					this.$emit('player');
				}
			},
		},
	}
</script>
