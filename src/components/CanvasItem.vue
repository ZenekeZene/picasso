<template>
	<section>
		<canvas
			ref="canvas"
			width="1698"
			height="1028"
			v-touch:start="handleMouseDown"
			v-touch:moving="handleMouseMove"
			v-touch:end="handleMouseUp"
		></canvas>
	</section>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import PlayerDot from '../mixins/PlayerDot.mixin';

export default {
	name: 'CanvasItem',
	mixins: [
		PlayerDot,
	],
	computed: {
		...mapState([
			'colorStroke',
			'colorErase',
			'strokeWidth',
			'canvas',
			'ctx',
			'indexLine',
			'mode',
			'isPainting',
			'isPlaying',
			'history',
		]),
	},
	data() {
		return {
			brush: true,
		};
	},
	methods: {
		...mapMutations([
			'setCanvas',
			'setBackgroundCanvas',
			'pushDotOnHistory',
			'createNewStrokeOnHistory',
			'deleteAllHistory',
			'incrementIndexLine',
			'setPaintingStatus',
		]),
		configureCanvas() {
			this.canvas.width = window.screen.width;
			this.canvas.height = window.screen.height;
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';
			this.ctx.lineWidth = this.strokeWidth;
			this.setBackgroundCanvas();
		},
		handleMouseDown(event) {
			if (this.mode === 'edit') {
				this.$emit('mouseDown', { status: false });
			}

			if (!this.isPainting && !this.isPlaying && this.mode === 'edit') {
				const { offsetX, offsetY } = event;
				this.prevPosition = { offsetX, offsetY };
				this.setPaintingStatus({ status: true });
				this.createNewStrokeOnHistory();
				if (!this.brush) {
					this.paint(this.getCoordinates());
				} else {
					this.paintDotPencil(event, {
						size: this.strokeWidth,
						color: this.colorStroke
					});
				} 
			}
		},
		handleMouseMove(event) {
			if (this.isPainting && !this.isPlaying && this.mode === 'edit') {
				if (!this.brush) {
					this.paint(this.getCoordinates());
				} else {
					if (!this.isPainting) return;
					this.paintDotPencil(event, {
						size: this.strokeWidth,
						color: this.colorStroke
					});
				} 
			}
		},
		handleMouseUp() {
			if (this.isPainting && !this.isPlaying && this.mode === 'edit') {
				this.setPaintingStatus({ status: false });
				if (this.isPainting && !this.isPlaying && this.mode === 'edit') {
				}
				this.incrementIndexLine();
				this.$emit('mouseup', false);
			}
			if (this.brush) {
				this.resetPaintDotPencil();
			} 
		},
		getCoordinates() {
			let offsetX;
			let offsetY;
			if (event.offsetX) {
				({ offsetX, offsetY } = event);
			} else {
				offsetX = event.touches[0].clientX;
				offsetY = event.touches[0].clientY;
			}
			return { offsetX, offsetY };
		},
		paint(currentPosition) {
			const { offsetX, offsetY } = currentPosition;
			const { offsetX: x, offsetY: y } = this.prevPosition;
			const dot = {
				size: this.strokeWidth,
				color: this.colorStroke,
				mousex: x,
				mousey: y,
				pmousex: offsetX,
				pmousey: offsetY,
			};
			this.paintDot(dot);
			this.pushDotOnHistory({ dot });
		},
	},
	mounted() {
		this.$store.commit('setCanvas', { canvasRef: this.$refs.canvas });
		this.configureCanvas();
		if (this.mode === 'edit') {
			this.player();
		}
	},
};
</script>