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
        async handleMouseDown(event) {
            try {
                await this.inputDown(event);
                const dot = await this.currentBrush.down(event, {
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
        this.$store.commit('setCanvas', { canvasRef: this.$refs.canvas });
        this.configureCanvas();
        this.changeBrush({ brushSelected: NeighbourBrush.name });
        if (this.brushSelected === NeighbourBrush.name) {
            this.currentBrush = new NeighbourBrush({
                ctx: this.ctx,
                theme: this.theme,
            });
        }
        if (this.mode === 'edit') {
            this.currentBrush.player(this.history);
        }
    },
};
</script>
