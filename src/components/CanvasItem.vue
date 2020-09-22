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
import { createBrush } from '../brushes';

export default {
    name: 'CanvasItem',
    mixins: [PlayerDot, ControlInput],
    computed: {
        ...mapState([
            'canvas',
            'ctx',
            'indexLine',
            'mode',
            'isPainting',
            'isPlaying',
            'brushIndex',
        ]),
        ...mapState('brush', [
            'colorStroke',
            'colorErase',
            'strokeWidth'
        ]),
        ...mapState('strokes', [
            'history',
            'indexLine',
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
            'setPaintingStatus',
        ]),
        ...mapMutations('strokes', [
            'pushDotOnHistory',
            'createNewStrokeOnHistory',
            'deleteAllHistory',
            'incrementIndexLine',
        ]),
        ...mapMutations('brush', [
            'changeBrush',
        ]),
        configureCanvas() {
            this.setCanvas({ canvasRef: this.$refs.canvas });
            this.ctx.lineWidth = this.strokeWidth;
            this.canvas.width = window.screen.width;
            this.canvas.height = window.screen.height;
            this.setBackgroundCanvas();
        },
        loadBrush() {
            this.changeBrush();
            this.currentBrush = createBrush(this.brushIndex, this.ctx, this.theme);
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'changeBrush') {
                    this.currentBrush = createBrush(this.brushIndex, this.ctx, this.theme);
                }
            });
        },
        async handleMouseDown(event) {
            try {
                await this.inputDown(event);
                const dot = await this.currentBrush.down(event, {
                    strokeWidth: this.strokeWidth,
                    colorStroke: this.colorStroke,
                });
                this.pushDotOnHistory({ dot, brushIndex: this.brushIndex });
            } catch (error) {
                this.logError(error);
            }
        },
        async handleMouseMove(event) {
            try {
                await this.inputMove();
                const dot = await this.currentBrush.move(event);
                this.pushDotOnHistory({ dot });
            } catch (error) {
                this.logError(error);
            }
        },
        async handleMouseUp() {
            try {
                await this.inputUp();
                await this.currentBrush.up();
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
