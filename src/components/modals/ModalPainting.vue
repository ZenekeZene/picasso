<template>
<modal name="modal-painting" :adaptive="true" :pivotY="0" height="auto" transition="fadeInDown">
	<span @click="$modal.hide('modal-painting')" class="icon-cross"></span>
	<swiper :options="swiperOptionMini" ref="swiper">
		<swiper-slide>
			<div padding>
				<h1>{{ $t('painting.save.name') }}</h1>
				<input type="text" :placeholder="$t('painting.save.placeholder')" v-model="name">
				<p class="note">{{ $t('painting.save.optional') }}</p>
				<button margin-top class="btn" @click="save">{{ $t('painting.save.cta') }}</button>
			</div>
		</swiper-slide>
	</swiper>
</modal>
</template>

<script>
import { mapState } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { savePainting } from '@/infra/PaintingRepository';

export default {
	name: 'ModalEdit',
	components: {
		swiper,
		swiperSlide,
	},
	data() {
		return {
			name: '',
			swiperOptionMini: {
				centeredSlides: true,
				slidesPerView: 1,
			},
		};
	},
	computed: {
		...mapState(['canvas']),
		...mapState('status', ['mode']),
		...mapState('strokes', ['history']),
		swiper() {
			return this.$refs.swiper.swiper;
		},
	},
	methods: {
		next() {
			this.swiper.slideNext();
		},
		async save() {
			this.$emit('showSpinner', { status: true });
			try {
				const blob = await this.getCanvasBlob();
				const response = await savePainting(this.name, blob, this.history);
				this.$toasted.show(this.$t('painting.sent'));
			} catch (error) {
				showError(error);
			} finally {
				this.$emit('showSpinner', { status: false });
				this.$modal.hide('modal-painting');
			}
		},
		getCanvasBlob() {
			return new Promise((resolve) => {
				this.canvas.toBlob((blob) => {
					resolve(blob);
				});
			});
		},
	},
};
</script>

<style scoped lang="scss">
.note {
	font-size: 14px;
}
</style>