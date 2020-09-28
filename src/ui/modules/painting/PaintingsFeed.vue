<template>
  <ol class="gallery">
    <li
      v-for="(paint, index) in paintings"
      :key="index"
    >
      <PaintingItem
        class="gallery__item"
        :class="{ '--selected': paintingSelected === paint.id }"
        :url="paint.url"
        :name="paint.name"
        :avgRating="paint.avgRating"
        :timestamp="paint.timestamp"
        @painting-clicked="goToPainting(paint)"
      />
    </li>
  </ol>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import PaintingItem from './PaintingItem';

export default {
  name: 'PaintingsFeed',
  components: {
    PaintingItem,
  },
  props: {
    paintings: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState('gallery', ['paintingSelected']),
  },
  methods: {
    ...mapMutations('status', ['setModeToReadable']),
    ...mapMutations('gallery', ['setPaintingSelected']),
    ...mapMutations('strokes', ['setHistory']),
    goToPainting(paint) {
			this.setModeToReadable();
			this.setPaintingSelected({ paintingSelected: paint.id });
			this.setHistory({ history: paint.history });
			this.$router.push({ name: 'paintById', params: { paintId: paint.id }});
		},
  }
};
</script>