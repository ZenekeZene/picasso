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
			points: [],
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
		paintDotPencil(e, config) {
			console.log(e);
			this.points.push({
				x: e.touches[0].clientX,
				y: e.touches[0].clientY,
			}); 
			this.ctx.beginPath();
			if (this.points[this.points.length - 2]) {
				this.ctx.moveTo(this.points[this.points.length - 2].x, this.points[this.points.length - 2].y);
				this.ctx.lineTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
			}
			this.ctx.lineWidth = config.size;
			this.ctx.strokeStyle = config.color;
			this.ctx.stroke();
			
			for (var i = 0, len = this.points.length; i < len; i++) {
				const dx = this.points[i].x - this.points[this.points.length - 1].x;
				const dy = this.points[i].y - this.points[this.points.length - 1].y;
				const d = dx * dx + dy * dy;

				if (d < 1000) {
					this.ctx.beginPath();
					this.ctx.moveTo( this.points[this.points.length-1].x + (dx * 0.2), this.points[this.points.length-1].y + (dy * 0.2));
					this.ctx.lineTo( this.points[i].x - (dx * 0.2), this.points[i].y - (dy * 0.2));
					this.ctx.stroke();
				}
			}
		},
		resetPaintDotPencil() {
			const points = this.points;
			this.points.length = 0;
			return points;
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
