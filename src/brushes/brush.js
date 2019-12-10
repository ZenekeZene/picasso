export default class Brush {
    strokeWidth;
    colorStroke;
    ctx;
    theme;

    constructor({ ctx, theme }) {
        this.ctx = ctx;
        this.theme = theme;
    }

    getCoordinates(event) {
        let offsetX;
        let offsetY;
        if (event.offsetX) {
            ({ offsetX, offsetY } = event);
        } else {
            offsetX = event.touches[0].clientX;
            offsetY = event.touches[0].clientY;
        }
        return { offsetX, offsetY };
    }

    configure({ lineJoin, lineCap, strokeWidth, colorStroke }) {
        this.ctx.lineJoin = lineJoin;
        this.ctx.lineCap = lineCap;
        this.strokeWidth = strokeWidth;
        this.colorStroke = colorStroke;
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
