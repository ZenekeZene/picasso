<template>
	<modal name="modal-rating" :adaptive="true" :pivotY="0" height="auto" transition="fadeInDown">
	<span @click="$modal.hide('modal-rating')" class="icon-cross"></span>
	<swiper :options="swiperOptionMini" ref="swiper">
		<swiper-slide>
			<div padding>
				<h1>Puntúa este dibujo</h1>
				<vue-stars v-model="ratingLocal"></vue-stars>
				<button margin-top class="btn" @click="sendRating">Enviar puntuación</button>
			</div>
		</swiper-slide>
	</swiper>
</modal>
</template>
<script>
import { mapState } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { VueStars } from "vue-stars";
import axios from 'axios';

export default {
	name: 'ModalRating',
	components: {
		swiper,
		swiperSlide,
		VueStars,
	},
	data() {
		return {
			swiperOptionMini: {
				centeredSlides: true,
				slidesPerView: 1,
			},
			ratingLocal: 1,
			ip: '',
		};
	},
	computed: {
		...mapState([
			'paintingSelected',
		]),
		swiper() {
			return this.$refs.swiper.swiper;
		},
	},
	props: {
		rating: {
			type: Number,
			default: 0,
		},
	},
	methods: {
		sendRating() {
			axios.get('https://api.ipify.org?format=json', {})
				.then((response) => {
					this.ip = response.data.ip;
				})
				.then(() => {
					window.db.collection('rating')
						.add({
							ip: this.ip,
							value: 3,
							paintingId: this.paintingSelected,
						}).then(() => {
							this.$toasted.show('Dibujo valorado!');
							this.$modal.hide('modal-rating')
						})
				})
				.catch((error) => {
					console.error(error);
				});
			/*window.db.collection('rating')
				.add({
					value: '3',
					ip: ''
				})
				*/
				



			/*const sum = Number(this.ratingLocal + this.rating);
			window.db.collection('painting')
				.doc(this.paintingSelected)
				.update({
					rating: sum,
				})
				.then(() => {
					this.$toasted.show('Dibujo valorado!');
					this.$emit('setRating', sum);
					this.$modal.hide('modal-rating')
				})
				.catch(() => {
					this.$toasted.show('Ha surgido un error!');
				});
				*/
		},
	},
};
</script>