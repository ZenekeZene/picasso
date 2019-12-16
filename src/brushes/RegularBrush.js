import Dot from '../entities/Dot';
import Brush from './Brush';

export default class RegularBrush extends Brush {
    prevPosition = {};

    constructor({ ctx, theme }) {
        super({ ctx, theme });
    }

    doStroke(dot) {
        this.ctx.beginPath();
        dot.applyStyles(this.ctx, this.theme);
        this.ctx.moveTo(dot.x, dot.y);
        this.ctx.lineTo(dot.px, dot.py);
        this.ctx.stroke();
    }

    paintDot(dot) {
        this.doStroke(dot);
        this.prevPosition = { offsetX: dot.px, offsetY: dot.py };
    }

    paint(currentPosition) {
        const { offsetX, offsetY } = currentPosition;
        const { offsetX: x, offsetY: y } = this.prevPosition;
        const dot = new Dot({
            size: this.strokeWidth,
            color: this.colorStroke,
            x,
            y,
            px: offsetX,
            py: offsetY,
        });
        this.paintDot(dot);
        return dot;
    }

    async down(event, { strokeWidth, colorStroke }) {
        super.configure({ strokeWidth, colorStroke });
        const { offsetX, offsetY } = event;
        this.prevPosition = { offsetX, offsetY };
        const dot = this.paint(Brush.getCoordinates(event));
        return Promise.resolve(dot);
    }

    async move(event) {
        const dot = this.paint(Brush.getCoordinates(event));
        return Promise.resolve(dot);
    }

    async up() {}

    playerStroke(stroke) {
        stroke.forEach((dotData) => {
            const dot = new Dot(dotData);
            this.paintDot(dot);
        });
    }

    async replay(history) {
        this.loop(
            0,
            history.length,
            (i) => {
                const dot = new Dot(history[i]);
                this.paintDot(dot);
            },
            () => Promise.resolve(),
            Brush.interval
        );
    }

    loop(index, howManyTimes, f, callback, ms) {
        let i = index;
        f(i);
        i += 1;
        if (i < howManyTimes) {
            this.loopTimer = setTimeout(() => {
                this.loop(i, howManyTimes, f, callback, ms);
            }, ms);
        } else {
            callback();
        }
    }
}
