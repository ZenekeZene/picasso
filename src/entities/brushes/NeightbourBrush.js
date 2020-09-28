import Dot from '../Dot';
import Brush from './Brush';

export default class NeightbourBrush extends Brush {
    points = [];

    constructor({ ctx, theme }) {
        super({ ctx, theme });
    }

    makeNeighbors() {
        for (let i = 0, len = this.points.length; i < len; i += 1) {
            const dx = this.points[i].x - this.points[this.points.length - 1].x;
            const dy = this.points[i].y - this.points[this.points.length - 1].y;
            const d = dx * dx + dy * dy;

            if (d < 1000) {
                this.ctx.beginPath();
                this.ctx.moveTo(
                    this.points[this.points.length - 1].x + dx * 0.2,
                    this.points[this.points.length - 1].y + dy * 0.2
                );
                this.ctx.lineTo(
                    this.points[i].x - dx * 0.2,
                    this.points[i].y - dy * 0.2
                );
                this.ctx.stroke();
            }
        }
    }

    paintDots() {
        this.ctx.beginPath();
        const neighbourLast = this.points[this.points.length - 2];
        const neighbourFirst = this.points[this.points.length - 1];
        if (neighbourLast) {
            this.ctx.moveTo(neighbourLast.x, neighbourLast.y);
        }
        if (neighbourFirst) {
            this.ctx.lineTo(neighbourFirst.x, neighbourFirst.y);
        }
        this.ctx.stroke();
        this.makeNeighbors();
    }

    paint(currentPosition) {
        const dot = new Dot({
            size: this.strokeWidth,
            color: this.colorStroke,
            x: currentPosition.offsetX,
            y: currentPosition.offsetY,
        });
        dot.applyStyles(this.ctx, this.theme);
        return dot;
    }

    async down(event, { strokeWidth, colorStroke }) {
        super.configure({ strokeWidth, colorStroke });
        const dot = this.paint(Brush.getCoordinates(event));
        this.points.length = 0;
        this.points.push(dot);
        return Promise.resolve(dot);
    }

    async move(event) {
        const dot = this.paint(Brush.getCoordinates(event));
        this.points.push(dot);
        this.paintDots();
        return Promise.resolve(dot);
    }

    async up() {
        this.points.length = 0;
    }

    playerStroke(stroke) {
        stroke.forEach((dotData) => {
            const dot = new Dot(dotData);
            dot.applyStyles(this.ctx, this.theme);
            this.points.push(dot);
            this.paintDots();
        });
        this.points.length = 0;
    }

    async replay(history) {
        this.player(history);
    }
}
