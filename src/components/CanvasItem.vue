<template>
    <section>
        <canvas
            ref="canvas"
            width="1698"
            height="1028"
            v-touch:start="handleMouseDown"
            v-touch:moving="handleMouseMove"
            v-touch:end="handleMouseUp"
        ></canvas>
    </section>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import PlayerDot from '../mixins/PlayerDot.mixin';
import ControlInput from '../mixins/ControlInput.mixin';
import Dot from '../entities/Dot';

export default {
    name: 'CanvasItem',
    mixins: [PlayerDot, ControlInput],
    computed: {
        ...mapState([
            'colorStroke',
            'colorErase',
            'strokeWidth',
            'canvas',
            'ctx',
            'indexLine',
            'mode',
            'isPainting',
            'isPlaying',
            'history',
        ]),
    },
    methods: {
        ...mapMutations([
            'setCanvas',
            'setBackgroundCanvas',
            'pushDotOnHistory',
            'createNewStrokeOnHistory',
            'deleteAllHistory',
            'incrementIndexLine',
            'setPaintingStatus',
        ]),
        configureCanvas() {
            this.canvas.width = window.screen.width;
            this.canvas.height = window.screen.height;
            this.configureStroke();
            this.setBackgroundCanvas();
        },
        configureStroke() {
            this.ctx.lineJoin = 'round';
            this.ctx.lineCap = 'round';
            this.ctx.lineWidth = this.strokeWidth;
        },
        handleMouseDown(event) {
            this.inputDown(event, () => {
                const { offsetX, offsetY } = event;
                this.prevPosition = { offsetX, offsetY };
                this.paint(this.getCoordinates(event));
            });
        },
        handleMouseMove(event) {
            this.inputMove(event, () => {
                this.paint(this.getCoordinates(event));
            });
        },
        handleMouseUp() {
            this.inputUp();
        },
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
            this.pushDotOnHistory({ dot });
        },
    },
    mounted() {
        this.$store.commit('setCanvas', { canvasRef: this.$refs.canvas });
        this.configureCanvas();
        if (this.mode === 'edit') {
            this.player();
        }
    },
};
</script>
