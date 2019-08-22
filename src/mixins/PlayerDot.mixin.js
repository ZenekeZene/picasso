import { mapState } from 'vuex';

var playerDot = {
	computed: {
		...mapState([
			'history',
			'ctx',
			'theme',
		]),
	},
	data() {
		return {
			prevPosition: { offsetX: 0, offsetY: 0 },
		};
	},
	methods: {
		paintPoint(point) {
			const x = point.x;
			const y = point.y;
			const offsetX = point.px;
			const offsetY = point.py;
			this.ctx.beginPath();
			this.ctx.lineWidth = point.size;
			this.ctx.strokeStyle = point.color;
			if (this.theme === 'light' && point.color === 'rgb(39, 39, 39)') {
				this.ctx.strokeStyle = 'rgb(246, 246, 246)';
			} else if (
				this.theme === 'dark' &&
				point.color === 'rgb(246, 246, 246)'
			) {
				this.ctx.strokeStyle = 'rgb(39, 39, 39)';
			}
			this.ctx.moveTo(x, y);
			this.ctx.lineTo(offsetX, offsetY);
			this.ctx.stroke();
			this.prevPosition = { offsetX, offsetY };
		},
		player() {
			for (let i = 0; i < this.history.length; i += 1) {
				const stroke = this.history[i];
				for (let j = 0; j < stroke.length; j += 1) {
					const point = stroke[j];
					this.paintPoint(point);
				}
			}
		},
	},
};

export default playerDot;
