<template>
    <section ref="canvasParent" style="width: 100%;">
        <v-stage id="canvas" ref="canvas" width="1698" height="1028" :config="configKonva"></v-stage>
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
    data() {
        return {
            currentBrush: null,
            stage: null,
            configKonva: {
                width: window.innerWidth,
                height: window.innerHeight,
                draggable: true,
            },
            // For mobile
            lastDist: 0,
            point: null,
        };
    },
    methods: {
        configureCanvas() {
            this.stage = this.$refs.canvas.getStage();
            var layer = new Konva.Layer();

            var hexagon = new Konva.RegularPolygon({
                x: 200,
                y: 200,
                sides: 6,
                radius: 70,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 4,
            });
            layer.add(hexagon);
            this.stage.add(layer);
            this.pinchZoomWheelEvent();
            this.pinchZoomTouchEvent();
        },
        pinchZoomWheelEvent() {
            this.stage.getContent().addEventListener('wheel', (wheelEvent) => {
                wheelEvent.preventDefault();
                const oldScale = this.stage.scaleX();

                const pointer = this.stage.getPointerPosition();
                const startPos = {
                    x: pointer.x / oldScale - this.stage.x() / oldScale,
                    y: pointer.y / oldScale - this.stage.y() / oldScale,
                };

                const deltaYBounded = !(wheelEvent.deltaY % 1)
                    ? Math.abs(Math.min(-10, Math.max(10, wheelEvent.deltaY)))
                    : Math.abs(wheelEvent.deltaY);
                const scaleBy = 1.01 + deltaYBounded / 70;
                const newScale =
                    wheelEvent.deltaY > 0
                        ? oldScale / scaleBy
                        : oldScale * scaleBy;
                this.stage.scale({ x: newScale, y: newScale });

                const newPosition = {
                    x: (pointer.x / newScale - startPos.x) * newScale,
                    y: (pointer.y / newScale - startPos.y) * newScale,
                };
                this.stage.position(newPosition);
                this.stage.batchDraw();
            });
        },
        getDistance(p1, p2) {
            return Math.sqrt(
                Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
            );
        },
        clientPointerRelativeToStage(clientX, clientY) {
            return {
                x: clientX - this.stage.getContent().offsetLeft,
                y: clientY - this.stage.getContent().offsetTop,
            };
        },
        pinchZoomTouchEvent() {
            this.stage.getContent().addEventListener(
                'touchmove',
                (event) => {
                    const t1 = event.touches[0];
                    const t2 = event.touches[1];
                    alert(t1, t2);

                    if (t1 && t2) {
                        event.preventDefault();
                        event.stopPropagation();
                        const oldScale = this.stage.scaleX();

                        const dist = getDistance(
                            { x: t1.clientX, y: t1.clientY },
                            { x: t2.clientX, y: t2.clientY }
                        );
                        if (!this.lastDist) this.lastDist = dist;
                        const delta = dist - this.lastDist;

                        const px = (t1.clientX + t2.clientX) / 2;
                        const py = (t1.clientY + t2.clientY) / 2;
                        const pointer =
                            this.point || this.clientPointerRelativeToStage(px, py);
                        if (!this.point) this.point = pointer;

                        const startPos = {
                            x: pointer.x / oldScale - this.stage.x() / oldScale,
                            y: pointer.y / oldScale - this.stage.y() / oldScale,
                        };

                        const scaleBy = 1.01 + Math.abs(delta) / 100;
                        const newScale =
                            delta < 0 ? oldScale / scaleBy : oldScale * scaleBy;
                        this.stage.scale({ x: newScal, y: newScale });

                        const newPosition = {
                            x: (pointer.x / newScale - startPos.x) * newScale,
                            y: (pointer.y / newScale - startPos.y) * newScale,
                        };

                        this.stage.position(newPosition);
                        this.stage.batchDraw();
                        this.lastDist = dist;
                    }
                },
                false
            );

            this.stage.getContent().addEventListener(
                'touchend',
                () => {
                    this.lastDist = 0;
                    alert('touchend');
                    this.point = undefined;
                },
                false
            );
        },
    },
    mounted() {
        this.configureCanvas();
    },
};
</script>
