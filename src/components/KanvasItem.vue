<template>
    <section ref="canvasParent" style="width: 100%;">
        <v-stage
            id="canvas"
            ref="canvas"
            width="1698"
            height="1028"
            :config="configKonva"
            @touchmove="touchmove"
        ></v-stage>
    </section>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import PlayerDot from '../mixins/PlayerDot.mixin';
import ControlInput from '../mixins/ControlInput.mixin';
import Dot from '../entities/Dot';
import { createBrush } from '../brushes';

export default {
    name: 'KanvasItem',
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
            'brushIndex',
        ]),
    },
    data() {
        return {
            currentBrush: null,
            stage: null,
            stageWidth: 1000,
            stageHeight: 1000,
            configKonva: {
                width: 1000,
                height: 1000,
                draggable: true,
                x: 1000 / 2,
                y: 1000 / 2,
                offset: {
                    x: 1000 / 2,
                    y: 1000 / 2
                }
            },
            scaleBy: 1.01,
            lastDist: 0,
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
        getDistance(p1, p2) {
            return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        },
        fitStageIntoParentContainer() {
            let container = this.$refs.canvasParent;
            this.$nextTick(() => {
                container = this.$refs.canvasParent;
                 // now we need to fit stage into parent
                const containerWidth = container.offsetWidth;
                console.log(containerWidth);
                // to do this we need to scale the stage
                const scale = containerWidth / 1000;

                this.stage.width(this.stageWidth * scale);
                this.stage.height(this.stageHeight * scale);
                this.stage.scale({ x: scale, y: scale });
                this.stage.draw();
            });
        },
        configureCanvas() {
            this.stage = this.$refs.canvas.getStage();
            var layer = new Konva.Layer();
            this.stage.add(layer);
            //this.setCanvas({ canvasRef: this.$refs.canvas });
            this.ctx.lineWidth = this.strokeWidth;
            window.addEventListener('resize', this.fitStageIntoParentContainer);
            this.fitStageIntoParentContainer();
            var hexagon = new Konva.RegularPolygon({
                x:200,
                y: 200,
                sides: 6,
                radius: 70,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 4
            });
            layer.add(hexagon);
            //this.setBackgroundCanvas();
        },
        touchmove(e) {
            e.evt.preventDefault();
            var touch1 = e.evt.touches[0];
            var touch2 = e.evt.touches[1];

            if (touch1 && touch2) {
                var dist = this.getDistance(
                    {
                        x: touch1.clientX,
                        y: touch1.clientY
                    },
                    {
                        x: touch2.clientX,
                        y: touch2.clientY
                    }
                );

                if (!this.lastDist) {
                    this.lastDist = dist;
                }

                var scale = (this.stage.scaleX() * dist) / this.lastDist;

                this.stage.scaleX(scale);
                this.stage.scaleY(scale);
                this.stage.batchDraw();
                this.lastDist = dist;
            }
        },
        touchend(e) {
            this.lastDist = 0;
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
        this.configureCanvas();
        //this.loadBrush();
        //this.player();
    },
};
</script>
