<template>
  <section>
    <transition name="fade">
      <div class="button-floated --bottom --left"
        v-if="mode === 'edit'"
        @click="backToPaint"
      >
        <span class="icon-forward --left"></span>
        <span class="label">{{ $t('gallery.back') }}</span>
      </div>
    </transition>
    <transition name="fade">
      <div
        class="button-floated --bottom --right"
        @click="goToCreateNewPainting"
        v-mobile-hover:#4992a9
      >
        <span class="label">{{ $t('gallery.create') }}</span>
        <span class="icon-write"></span>
      </div>
    </transition>
  </section>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'GalleryActions',
  computed: {
    ...mapState('status', ['mode']),
  },
  methods: {
    ...mapMutations('status', ['setModeToEditable']),
		...mapMutations('strokes', [
			'deleteAllHistory',
			'resetIndexLine',
    ]),
    ...mapMutations('gallery', ['setPaintingSelected']),
    backToPaint(event) {
			if (event.target.classList.contains('--disabled')) return;
			if (this.paintingSelected) {
				this.$router.push({ name: 'paintById', params: { paintId: this.paintingSelected }});
			} else {
				this.$router.push({ name: 'paint' });
			}
		},
		goToCreateNewPainting(event) {
			if (event.target.classList.contains('--disabled')) return;
			this.$router.push({ name: 'paint' });
			this.setModeToEditable();
			this.deleteAllHistory();
			this.resetIndexLine();
			this.setPaintingSelected({ paintingSelected: null });
		},
  }
}
</script>