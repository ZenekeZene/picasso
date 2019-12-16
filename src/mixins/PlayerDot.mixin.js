import { mapState } from 'vuex';
import { createBrush } from '../brushes';

const playerDot = {
    computed: {
        ...mapState(['history', 'ctx', 'theme']),
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
            this.history.forEach((stroke) => {
                if (stroke[0]) {
                    const { brushIndex } = stroke[0];
                    const inst = createBrush(brushIndex, this.ctx, this.theme);
                    inst.playerStroke(stroke);
                }
            });
        },
    },
};

export default playerDot;
