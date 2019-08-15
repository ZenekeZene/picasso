<template>
	<modal name="modal-rating" :adaptive="true" :pivotY="0" height="auto" transition="fadeInDown">
	<span @click="$modal.hide('modal-rating')" class="icon-cross"></span>
	<swiper :options="swiperOptionMini" ref="swiper">
		<swiper-slide>
			<div padding>
				<h1>Puntúa este dibujo</h1>
				<p>Contruyéndolo...&nbsp;&nbsp;⚒️&nbsp;&nbsp;🚧&nbsp;&nbsp;📐&nbsp;&nbsp;😅</p>
				<button margin-top class="btn" @click="$emit('sendRating')">Enviar puntuación</button>
			</div>
		</swiper-slide>
	</swiper>
</modal>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
	name: 'ModalRating',
	components: {
		swiper,
		swiperSlide,
	},
	data() {
		return {
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
};
</script>