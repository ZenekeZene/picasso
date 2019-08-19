<template>
	<modal name="modal-rating" :adaptive="true" :pivotY="0" height="auto" transition="fadeInDown">
	<span @click="$modal.hide('modal-rating')" class="icon-cross"></span>
	<swiper :options="swiperOptionMini" ref="swiper">
		<swiper-slide>
			<div padding>
				<h1>Puntúa este dibujo</h1>
				<vue-stars v-model="rating"></vue-stars>
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
			rating: 1,
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
	mounted() {
		axios.get('https://api.ipify.org?format=json', {})
				.then((response) => {
					this.ip = response.data.ip;
				}).then(() => {
					this.rating = window.db.collection('rating')
						.doc(`${this.ip}-${this.paintingSelected}`)
						.get()
						.then((doc) => {
							if (doc.exists) {
								this.rating = doc.data().value;
							} else {
								this.rating = 1;
							}
						})
						.catch((error) => {
							console.error(error);
						});
				})
				.catch((error) => {
					console.error(error);
				});
	},
	methods: {
		sendRating() {
			this.$emit('showSpinner', { status: true });
			const document = window.db.collection('painting').doc(this.paintingSelected);
			window.db.runTransaction((transaction) => {
				return transaction.get(document).then((doc) => {
					var data = doc.data();

					let newAverage =
						(data.numRatings * data.avgRating + this.rating) /
						(data.numRatings + 1);

					transaction.update(document, {
						numRatings: data.numRatings + 1,
						avgRating: newAverage
					});
				});
			}).then(() => {
				this.$toasted.show('¡Valoración enviada!');
				this.$emit('showSpinner', { status: false });
				this.$modal.hide('modal-rating');
			}).catch((error) => {
				console.error(error);
				this.$emit('showSpinner', { status: false });
				this.$modal.hide('modal-rating');
			});
		},
	},
};
</script>