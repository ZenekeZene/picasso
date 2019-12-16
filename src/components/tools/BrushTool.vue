<template>
    <li class="tools__item" v-if="mode === 'edit'" relative>
        <span
            class="icon"
            v-show="!toolsVisible"
            :class="getBrushClassname"
        ></span>
        <ol class="brushes" v-show="toolsVisible">
            <li
                v-for="(brusher, index) in brushes"
                :key="`brush-${index}`"
                @click="changeBrush({ brushIndex: index })"
                :class="{ '--selected': brushIndex === index }"
            >
                <span
                    :class="`icon-${brusher.iconClassname}`"
                    v-mobile-hover:#4992a9
                ></span>
            </li>
        </ol>
    </li>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { brushes } from '../../brushes';

export default {
    name: 'BrushTool',
    props: {
        toolsVisible: {
            default: false,
            type: Boolean,
        },
    },
    computed: {
        ...mapState(['isPainting', 'isPlaying', 'mode', 'brushIndex']),
        getBrushClassname() {
            let classnames = `icon-${this.brushes[this.brushIndex].iconClassname}`;
            if (this.isPlaying || this.isPainting || this.mode === 'read') {
                classnames += '--disabled';
            }
            return classnames;
        },
    },
    data() {
        return {
            brushes: brushes,
        };
    },
    props: {
        toolsVisible: {
            default: false,
            type: Boolean,
        },
    },
    methods: {
        ...mapMutations(['changeBrush']),
    },
};
</script>
