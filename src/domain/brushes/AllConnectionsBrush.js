import Dot from '../Dot';
import Brush from './Brush';

export default class AllConnectionsBrush extends Brush {
    points = [];

    constructor({ ctx, theme }) {
        super({ ctx, theme });
    }

    makeNeighbors() {
        for (let i = 1; i < this.points.length; i += 1) {
            this.ctx.lineTo(this.points[i].x, this.points[i].y);
            const nearPoint = this.points[i - 5];
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
        const dot = this.paint(Brush.getCoordinates(event));
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
