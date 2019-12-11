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
import { RegularBrush, NeighbourBrush } from '../brushes/Brushes';
import ControlInput from '../mixins/ControlInput.mixin';
import Dot from '../entities/Dot';
import brushesUI from '../brushes/brushesUI';

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
            'brushSelected',
        ]),
    },
    data() {
        return {
            currentBrush: null,
        };
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
            'changeBrush',
        ]),
        configureCanvas() {
            this.$store.dispatch('loadCanvas', { canvasRef: this.$refs.canvas });
            this.ctx.lineWidth = this.strokeWidth;
            this.canvas.width = window.screen.width;
            this.canvas.height = window.screen.height;
            this.setBackgroundCanvas();
        },
        loadBrush() {
            this.brushes = brushesUI;
            this.changeBrush({ brushSelected: this.brushes[0] });
        },
        async handleMouseDown(event) {
            try {
                await this.inputDown(event);
                const dot = await this.brushSelected.instance.down(event, {
                    strokeWidth: this.strokeWidth,
                    colorStroke: this.colorStroke,
                });
                this.pushDotOnHistory({ dot });
            } catch (error) {
                this.logError(error);
            }
        },
        async handleMouseMove(event) {
            try {
                await this.inputMove();
                const dot = await this.brushSelected.instance.move(event);
                this.pushDotOnHistory({ dot });
            } catch (error) {
                this.logError(error);
            }
        },
        async handleMouseUp() {
            try {
                await this.inputUp();
                await this.brushSelected.instance.up();
            } catch (error) {
                this.logError(error);
            }
        },
        logError(error) {
            if (typeof error !== 'undefined') console.error(error);
        },
    },
    mounted() {
        this.configureCanvas();
        this.loadBrush();
        this.player();
    },
};
</script>
