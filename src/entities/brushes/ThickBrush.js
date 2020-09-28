const imageSrc = require('@/assets/brushes/thick.png');
import Dot from '../Dot';
import Brush from './Brush';

export default class ThickBrush extends Brush {
  lastPoint = null;
  img = new Image();

  constructor({ ctx, theme }) {
    super({ ctx, theme });
    this.img.src = imageSrc;
  }

  static distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }

  static angleBetween(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  }

  paintImage(dot) {
    const dist = ThickBrush.distanceBetween(this.lastPoint, dot);
    const angle = ThickBrush.angleBetween(this.lastPoint, dot);
    for (let i = 0; i < dist; i += 1) {
      const x = this.lastPoint.x + (Math.sin(angle) * i) - 25;
      const y = this.lastPoint.y + (Math.cos(angle) * i) - 25;
      this.ctx.drawImage(this.img, x, y);
    }
  }

  paint(currentPosition) {
    const { offsetX, offsetY } = currentPosition;
    const dot = new Dot({
      size: this.strokeWidth,
      color: this.colorStroke,
      x: offsetX,
      y: offsetY,
    });
    dot.applyStyles(this.ctx, this.theme);
    return dot;
  }

  async down(event, { strokeWidth, colorStroke }) {
    super.configure({ strokeWidth, colorStroke });
    const dot = this.paint(Brush.getCoordinates(event));
    this.lastPoint = dot;
    return Promise.resolve(dot);
  }

  async move(event) {
    const dot = this.paint(Brush.getCoordinates(event));
    this.paintImage(dot);
    this.lastPoint = dot;
    return Promise.resolve(dot);
  }

  async up() {}

  playerStroke(stroke) {
    this.lastPoint = [stroke];
    stroke.forEach((dotData) => {
        const dot = new Dot(dotData);
        this.paintImage(dot);
        this.lastPoint = dot;
    });
  }

  async replay(history) {
    this.player(history);
  }
}
