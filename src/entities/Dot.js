export default class Dot {
	constructor({
		size,
		color,
		x,
		y,
		px,
		py,
	}) {
		this.size = size;
		this.color = color;
		this.x = x;
		this.y = y;
		this.px = px;
		this.py = py;
	}

	applyStyles(contextEntry, theme) {
		const context = contextEntry;
		context.lineWidth = this.size;
		context.strokeStyle = this.color;
		if (theme === 'light' && this.color === 'rgb(39, 39, 39)') {
			context.strokeStyle = 'rgb(246, 246, 246)';
		} else if (
			theme === 'dark' &&
			this.color === 'rgb(246, 246, 246)'
		) {
			context.strokeStyle = 'rgb(39, 39, 39)';
		}
	}
}
