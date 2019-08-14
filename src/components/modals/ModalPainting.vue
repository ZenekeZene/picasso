<template>
<modal name="modal-painting" :adaptive="true" :pivotY="0" height="auto" transition="fadeInDown">
	<span @click="$modal.hide('modal-painting')" class="icon-cross"></span>
	<swiper :options="swiperOptionMini" ref="swiper">
		<swiper-slide>
			<div padding>
				<h1>Ponle<br/> nombre a tu dibujo</h1>
				<input type="text" placeholder="Nombra tu dibujo" v-model="name">
				<button margin-top class="btn" @click="$emit('sendPainting', { 'name': name })">Enviar dibujo</button>
			</div>
		</swiper-slide>
	</swiper>
</modal>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';

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
		swiper() {
			return this.$refs.swiper.swiper;
		},
	},
	methods: {
		next() {
			this.swiper.slideNext();
		},
	},
};
</script>
