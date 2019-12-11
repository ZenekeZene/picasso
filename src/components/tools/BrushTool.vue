<template>
  <li class="tools__item" v-if="mode === 'edit' && brushSelected" relative>
    <span
      class="icon"
      v-show="!toolsVisible"
      :class="getBrushClassname"
    ></span>
    <ol class="brushes" v-show="toolsVisible">
      <li
        v-for="(brusher, index) in brushes"
        :key="`brush-${index}`"
        @click="changeBrush({ brushSelected: brusher })"
        :class="{ '--selected': brushSelected.key === brusher.key }"
      >
        <span :class="`icon-${brusher.iconClassname}`" v-mobile-hover:#4992a9></span>
      </li>
    </ol>
  </li>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import brushesUI from '../../brushes/brushesUI';

export default {
    name: 'BrushTool',
    props: {
        toolsVisible: {
            default: false,
            type: Boolean,
        },
    },
    computed: {
        ...mapState(['isPainting', 'isPlaying', 'mode', 'brushSelected']),
        getBrushClassname() {
			if (!this.brushSelected) return '';
			let classnames = `icon-${this.brushSelected.iconClassname}`;
            if (this.isPlaying || this.isPainting || this.mode === 'read') {
				classnames += '--disabled';
			}
			return classnames;
        },
    },
    data() {
        return {
            brushes: brushesUI,
        };
    },
    props: {
        toolsVisible: {
            default: false,
            type: Boolean,
        },
    },
    mounted() {
        this.brushes = brushesUI;
    },
    methods: {
        ...mapMutations(['changeBrush']),
    },
};
</script>