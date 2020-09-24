<template>
	<modal name="modal-rating" :adaptive="true" :pivotY="0" height="auto" transition="fadeInDown">
	<span @click="$modal.hide('modal-rating')" class="icon-cross"></span>
	<swiper :options="swiperOptionMini" ref="swiper">
		<swiper-slide>
			<div padding>
				<h1>Puntúa esta firma</h1>
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
				<button margin-top class="btn" @click="sendRating">Enviar puntuación</button>
			</div>
		</swiper-slide>
	</swiper>
</modal>
</template>
<script>
import { mapState } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import StarRating from 'vue-star-rating';
import axios from 'axios';

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
			ip: '',
		};
	},
	computed: {
		...mapState('gallery', ['paintingSelected',]),
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
			window.db.runTransaction(transaction => transaction.get(document)
				.then((doc) => {
					const data = doc.data();

					const newAverage =
						(data.numRatings * data.avgRating + this.rating) /
						(data.numRatings + 1);

					transaction.update(document, {
						numRatings: data.numRatings + 1,
						avgRating: newAverage,
					});
				}))
			.then(() => {
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
