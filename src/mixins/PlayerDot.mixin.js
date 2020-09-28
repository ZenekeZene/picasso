import { mapState } from 'vuex';
import { createBrush } from '@/entities/brushes';

const playerDot = {
  computed: {
    ...mapState(['ctx', 'theme']),
    ...mapState('strokes', ['history']),
  },
  data() {
    return {
      prevPosition: { offsetX: 0, offsetY: 0 },
    };
  },
  methods: {
    paintDot(dot) {
      this.doStroke(dot);
      this.prevPosition = { offsetX: dot.px, offsetY: dot.py };
    },
    doStroke(dot) {
      this.ctx.beginPath();
      dot.applyStyles(this.ctx, this.theme);
      this.ctx.moveTo(dot.x, dot.y);
      this.ctx.lineTo(dot.px, dot.py);
      this.ctx.stroke();
    },
    player() {
      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = 'round';
      if (this.history && this.history.length > 0) {
        this.history.forEach((stroke) => {
          if (stroke[0]) {
            const { brushIndex } = stroke[0];
            const inst = createBrush(brushIndex || 0, this.ctx, this.theme);
            inst.playerStroke(stroke);
          }
        });
      }
    },
  },
};

export default playerDot;
