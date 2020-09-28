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
        @click="changeBrush(index)"
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
import { brushes } from '@/domain/brushes';

export default {
  name: 'BrushTool',
  props: {
    toolsVisible: {
        default: false,
        type: Boolean,
    },
  },
  computed: {
    ...mapState('status', ['isPainting', 'isPlaying', 'mode']),
    ...mapState('brush', ['brushIndex']),
    getBrushClassname() {
      let classnames = `icon-${
          this.brushes[this.brushIndex].iconClassname
      }`;
      if (this.isPlaying || this.isPainting || this.mode === 'read') {
        classnames += '--disabled';
      }
      return classnames;
    },
  },
  data() {
    return {
      brushes,
    };
  },
  methods: {
    ...mapMutations('brush', ['changeBrush']),
  },
};
</script>
