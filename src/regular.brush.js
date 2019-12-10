import Dot from './entities/Dot';

const regularBrush = {
    prevPosition: {},
    strokeWidth: null,
    colorStroke: null,
    config({ ctx, theme }) {
        this.ctx = ctx;
        this.theme = theme;
    },
};

function $() {
    return regularBrush;
}

function getCoordinates(event) {
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

function doStroke(dot) {
    $().ctx.beginPath();
    dot.applyStyles($().ctx, $().theme);
    $().ctx.moveTo(dot.x, dot.y);
    $().ctx.lineTo(dot.px, dot.py);
    $().ctx.stroke();
}

function paintDot(dot) {
    doStroke(dot);
    $().prevPosition = { offsetX: dot.px, offsetY: dot.py };
}

async function paint(currentPosition) {
    const { offsetX, offsetY } = currentPosition;
    const { offsetX: x, offsetY: y } = $().prevPosition;
    const dot = new Dot({
        size: $().strokeWidth,
        color: $().colorStroke,
        x,
        y,
        px: offsetX,
        py: offsetY,
    });
    paintDot(dot);
    return Promise.resolve(dot);
}

async function down(event, { strokeWidth, colorStroke }) {
    $().strokeWidth = strokeWidth;
    $().colorStroke = colorStroke;
    const { offsetX, offsetY } = event;
    $().prevPosition = { offsetX, offsetY };
    return Promise.resolve(await paint(getCoordinates(event)));
}

async function move(event) {
    return Promise.resolve(await paint(getCoordinates(event)));
}

// Meter aqui tambien el replay?
regularBrush.move = move;
regularBrush.down = down;
export default regularBrush;
