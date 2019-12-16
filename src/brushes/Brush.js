export default class Brush {
    strokeWidth;

    colorStroke;

    ctx;

    theme;

    static interval = 100; // ms

    constructor({ ctx, theme }) {
        this.ctx = ctx;
        this.theme = theme;
    }

    configure({ strokeWidth, colorStroke }) {
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.strokeWidth = strokeWidth;
        this.colorStroke = colorStroke;
    }

    static loop(index, howManyTimes, f, callback, ms) {
        let i = index;
        f(i);
        i += 1;
        if (i < howManyTimes) {
            setTimeout(() => {
                Brush.loop(i, howManyTimes, f, callback, ms);
            }, ms);
        } else {
            callback();
        }
    }

    static getCoordinates(event) {
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
}
