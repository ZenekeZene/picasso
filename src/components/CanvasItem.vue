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
import regularBrush from '../brushes/regular.brush';
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
        async handleMouseDown(event) {
            try {
                await this.inputDown(event)
                const dot = await regularBrush.down(event, {
                    strokeWidth: this.strokeWidth,
                    colorStroke: this.colorStroke
                });
                this.pushDotOnHistory({ dot });
            } catch(error) {}
        },
        async handleMouseMove(event) {
            try {
                await this.inputMove();
                const dot = await regularBrush.move(event, this.paint);
                this.pushDotOnHistory({ dot });
            } catch(error) {}
        },
        async handleMouseUp() {
            try {
                await this.inputUp();
            } catch(error) {}
        },
    },
    mounted() {
        this.$store.commit('setCanvas', { canvasRef: this.$refs.canvas });
        this.configureCanvas();
        regularBrush.config({ ctx: this.ctx, theme: this.theme });
        if (this.mode === 'edit') {
            this.player();
        }
    },
};
</script>
