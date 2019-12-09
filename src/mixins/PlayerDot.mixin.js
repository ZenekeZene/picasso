import { mapState } from 'vuex';
import Dot from '../entities/Dot';

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
            this.history.forEach((stroke) => {
                stroke.forEach((dotData) => {
                    const dot = new Dot(dotData);
                    this.paintDot(dot);
                });
            });
        },
    },
};

export default playerDot;
