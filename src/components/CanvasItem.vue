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
			points: [],
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
				const point = this.getPoint(event);
				this.points.push(point);
				this.paintPoint(point);
			}
		},
		handleMouseMove(event) {
			if (this.isPainting && !this.isPlaying && this.mode === 'edit') {
				const dot = this.getPoint(event);
				this.points.push(dot);
				this.ctx.beginPath();
				this.ctx.moveTo(this.points[0].x, this.points[0].y);
				for (var i = 1; i < this.points.length; i++) {
					this.ctx.lineTo(this.points[i].x, this.points[i].y);
					this.prevPosition.offsetX = this.points[i].px;
					this.prevPosition.offsetY = this.points[i].py;
				}
				this.ctx.stroke();
			}
		},
		handleMouseUp() {
			if (this.isPainting && !this.isPlaying && this.mode === 'edit') {
				this.setPaintingStatus({ status: false });
				this.$emit('mouseup', false);
				const points = [...this.points];
				this.prevPosition.offsetX = null;
				this.prevPosition.offsetY = null;
				this.pushDotOnHistory({ dot: points });
				this.points.length = 0;
			} 
		},
		getPoint(event) {
			const currentPosition = {
				offsetX: event.touches[0].clientX,
				offsetY: event.touches[0].clientY,
			};
			const { offsetX, offsetY } = currentPosition;
			const { offsetX: x, offsetY: y } = this.prevPosition;
			const point = {
				x: x,
				y: y,
				px: offsetX,
				py: offsetY,
				size: Number(this.strokeWidth),
				color: this.colorStroke,
			};
			this.ctx.lineWidth = this.strokeWidth;
			this.ctx.strokeStyle = this.colorStroke;
			return point;
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