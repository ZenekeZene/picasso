import { mapState } from 'vuex';
import Dot from '../entities/Dot';
import brushesUI from '../brushes/brushesUI';

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
                let typeBrush = stroke[0].brush;
                let refBrush = brushesUI.find(brushUI => brushUI.key === typeBrush);
                let inst = new refBrush.ref({ ctx: this.ctx, theme: this.theme });
                inst.playerStroke(stroke);
            });
        },
    },
};

export default playerDot;
