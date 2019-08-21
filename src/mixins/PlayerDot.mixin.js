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
		paintDot(dot) {
			const x = dot.mousex;
			const y = dot.mousey;
			const offsetX = dot.pmousex;
			const offsetY = dot.pmousey;
			this.ctx.beginPath();
			this.ctx.lineWidth = dot.size;
			this.ctx.strokeStyle = dot.color;
			if (this.theme === 'light' && dot.color === 'rgb(39, 39, 39)') {
				this.ctx.strokeStyle = 'rgb(246, 246, 246)';
			} else if (
				this.theme === 'dark' &&
				dot.color === 'rgb(246, 246, 246)'
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
					const dot = stroke[j];
					this.paintDot(dot);
				}
			}
		},
	},
};

export default playerDot;
