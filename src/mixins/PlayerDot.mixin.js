import { mapState } from 'vuex';

var playerDot = {
	computed: {
		...mapState(['history', 'ctx', 'theme', 'brush']),
	},
	data() {
		return {
			prevPosition: { offsetX: 0, offsetY: 0 },
			loopTimer: null,
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
		paintPointComplex(pointsEntry, i) {
			this.ctx.lineTo(pointsEntry[i].x, pointsEntry[i].y);
			let nearPoint = pointsEntry[i - 5];
			if (nearPoint) {
				this.ctx.moveTo(nearPoint.x, nearPoint.y);
				this.ctx.lineTo(pointsEntry[i].x, pointsEntry[i].y);
			}
			this.ctx.stroke();
		},
		paintNeighborBrush(pointsEntry) {
			return new Promise((resolve) => {
				this.ctx.beginPath();
				this.ctx.moveTo(pointsEntry[0].x, pointsEntry[0].y);
				this.ctx.lineWidth = pointsEntry[0].size;
				this.ctx.strokeStyle = pointsEntry[0].color;

				const loop = async () => {
					for (let i = 0; i < pointsEntry.length; i++) {
						await new Promise((resolve) => {
							setTimeout(() => {
								this.paintPointComplex(pointsEntry, i);
								resolve();
							});
						});
					}
				};
				loop().then(() => {
					// Acabado points
					resolve();
				});
			});
		},
		player() {
			for (let i = 0; i < this.history.length; i++) {
				this.ctx.beginPath();
				const stroke = this.history[i];
				this.ctx.moveTo(stroke[0].x, stroke[0].y);
				this.ctx.lineWidth = stroke[0].size;
				this.ctx.strokeStyle = stroke[0].color;
				for (let j = 0; j < this.history[i].length; j++) {
					this.paintPointComplex(stroke, j);
				};
			}
		},
	},
};

export default playerDot;
