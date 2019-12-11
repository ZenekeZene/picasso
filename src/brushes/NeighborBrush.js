import Dot from '../entities/Dot';
import Brush from './Brush';

export default class NeighborBrush extends Brush {
    points = [];

    constructor({ ctx, theme }) {
        super({ ctx, theme });
    }

    makeNeighbors() {
        for (var i = 1; i < this.points.length; i++) {
            this.ctx.lineTo(this.points[i].x, this.points[i].y);
            var nearPoint = this.points[i - 5];
            if (nearPoint) {
                this.ctx.moveTo(nearPoint.x, nearPoint.y);
                this.ctx.lineTo(this.points[i].x, this.points[i].y);
            }
        }
    }

    paintDots() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.points[0].x, this.points[0].y);
        this.makeNeighbors();
        this.ctx.stroke();
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
        const dot = this.paint(super.getCoordinates(event));
        this.points.push(dot);
        return Promise.resolve(dot);
    }

    async move(event) {
        const dot = this.paint(super.getCoordinates(event));
        this.points.push(dot);
        this.paintDots();
        return Promise.resolve(dot);
    }

    async up() {
        this.points.length = 0;
        return Promise.resolve();
    }

    player(history) {
        history.forEach((stroke) => {
            this.points = [];
            stroke.forEach((dotData) => {
                const dot = new Dot(dotData);
                dot.applyStyles(this.ctx, this.theme);
                this.points.push(dot);
                this.paintDots(dot);
            });
        });
        this.points.length = 0;
    }

    async replay(history) {
        this.player(history);
    }
}
