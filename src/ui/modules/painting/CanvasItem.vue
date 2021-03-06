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
import PlayerDot from '@/adapter/mixins/PlayerDot.mixin';
import ControlInput from '@/adapter/mixins/ControlInput.mixin';
import Dot from '@/domain/Dot';
import { createBrush } from '@/domain/brushes';

export default {
  name: 'CanvasItem',
  mixins: [PlayerDot, ControlInput],
  computed: {
    ...mapState(['canvas', 'ctx']),
    ...mapState('status', [
      'mode',
      'isPainting',
      'isPlaying',
      'toolsVisible',
    ]),
    ...mapState('brush', [
      'colorStroke',
      'colorErase',
      'strokeWidth',
      'brushIndex',
    ]),
    ...mapState('strokes', ['history', 'indexLine']),
  },
  data() {
    return {
      currentBrush: null,
    };
  },
  methods: {
    ...mapMutations(['setCanvas', 'setBackgroundCanvas']),
    ...mapMutations('status', ['setPaintingStatus', 'setToolsVisible']),
    ...mapMutations('strokes', [
      'pushDotOnHistory',
      'createNewStrokeOnHistory',
      'deleteAllHistory',
      'incrementIndexLine',
    ]),
    ...mapMutations('brush', ['changeBrush']),
    configureCanvas() {
      this.setCanvas({ canvasRef: this.$refs.canvas });
      this.ctx.lineWidth = this.strokeWidth;
      this.canvas.width = window.screen.width;
      this.canvas.height = window.screen.height;
      this.setBackgroundCanvas();
    },
    loadBrush() {
      this.changeBrush();
      this.currentBrush = createBrush(
        this.brushIndex,
        this.ctx,
        this.theme
      );
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'brush/changeBrush') {
          this.currentBrush = createBrush(
            this.brushIndex,
            this.ctx,
            this.theme
          );
        }
      });
    },
    async handleMouseDown(event) {
      if (this.toolsVisible) {
        this.setToolsVisible({ toolsVisible: false });
        return false;
      }
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
