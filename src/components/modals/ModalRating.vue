<template>
	<modal
		name="modal-rating"
		:adaptive="true"
		:pivotY="0"
		height="auto"
		transition="fadeInDown"
	>
	<span @click="$modal.hide('modal-rating')" class="icon-cross"></span>
	<swiper :options="swiperOptionMini" ref="swiper">
		<swiper-slide>
			<div padding>
				<h1>{{ $t('painting.rating.title') }}</h1>
				<star-rating
					v-model="rating"
					:star-size="60"
					:padding="3"
					:glow="0"
					:rounded-corners="true"
					:border-width="0"
					:increment="0.5"
					:fixed-points="2"
					:show-rating="false"
					:round-start-rating="false"
					margin-vertical-2
				></star-rating>
				<button
					margin-top
					class="btn"
					@click="sendRating"
				>{{ $t('painting.rating.cta') }}</button>
			</div>
		</swiper-slide>
	</swiper>
</modal>
</template>
<script>
import { mapState } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import StarRating from 'vue-star-rating';
import { getRating, sendRating } from '@/infra/RatingRepository';

export default {
	name: 'ModalRating',
	components: {
		swiper,
		swiperSlide,
		StarRating,
	},
	data() {
		return {
			swiperOptionMini: {
				centeredSlides: true,
				slidesPerView: 1,
			},
			rating: 1,
		};
	},
	computed: {
		...mapState('gallery', ['paintingSelected']),
		swiper() {
			return this.$refs.swiper.swiper;
		},
	},
	async mounted() {
		if (this.paintingSelected) {
			this.rating = await getRating(this.paintingSelected);
		}
	},
	methods: {
		async sendRating() {
			this.$emit('showSpinner', { status: true });
			try {
				await sendRating(this.paintingSelected, this.rating);
				this.$toasted.show(this.$t('painting.rating.sent'));
			} catch (error) {
				console.error(error);
				this.$toasted.show(this.$t('error.general'));
			} finally {
				this.$emit('showSpinner', { status: false });
				this.$modal.hide('modal-rating');
			}
		},
	},
};
</script>
