import { mapState } from 'vuex';

const playerDot = {
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
			this.applyStyles(dot);
			this.ctx.moveTo(x, y);
			this.ctx.lineTo(offsetX, offsetY);
			this.ctx.stroke();
			this.prevPosition = { offsetX, offsetY };
		},
		applyStyles(dot) {
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
		},
		player() {
			this.history.map((stroke) => stroke.map((dot) => this.paintDot(dot)));
		},
	},
};

export default playerDot;
