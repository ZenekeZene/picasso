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
}
