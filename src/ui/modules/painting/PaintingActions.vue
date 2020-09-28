<template>
  <section>
    <transition name="fade" appear>
      <div class="button-floated --bottom --left"
        v-mobile-hover:#4992a9
        @click.stop.prevent="goToGallery"
      >
        <span class="icon-book"></span>
        <span class="label">{{ $t('gallery.title') }}</span>
      </div>
    </transition>
    <transition name="fade" appear>
      <div class="button-floated --bottom --right"
        v-if="mode === 'read'"
        v-mobile-hover:#4992a9
        @click.stop.prevent="launchRating"
      >
        <span class="label">{{ $t('painting.rating.cta') }}</span>
        <span class="icon-star-full"></span>
      </div>
    </transition>
  </section>
</template>
<script>
import { mapState, mapMutations  } from 'vuex';

export default {
  name: 'PaintingActions',
  computed: {
    ...mapState('status', ['mode']),
  },
  methods: {
    ...mapMutations('status', ['setPlayingStatus']),
    isOptionEnabled(event) {
			return !event.target.classList.contains('--disabled');
		},
    goToGallery(event) {
			if (this.isOptionEnabled(event)) {
				this.setPlayingStatus({ status: false });
				this.$router.push({ name: 'gallery' });
			}
		},
    launchRating(event) {
			if (this.isOptionEnabled(event)) {
				this.$modal.show('modal-rating');
			}
		},
  }
};
</script>