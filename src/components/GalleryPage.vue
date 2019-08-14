<template>
	<article class="p-gallery">
		<p class="intro">Dibujos aleatorios de gente muy local:</p>
		<transition name="fade" mode="out-in">
			<p v-if="!isLoading && paintings.length === 0" margin-top block font-size-xs text-center>Aún no hay dibujos.</p>
			<div v-else style="width: 100%; height: 100%;">
				<spinner-item v-if="isLoading" block margin-auto-horizontal margin-top></spinner-item>
				<section class="gallery-wrapper">
					<ol class="gallery">
						<li class="gallery__item"
							v-for="paint in paintings"
							:key="paint.id"
							@click="goToPainting(paint)"
						>
							<transition-group name="fade" mode="out-in" tag="div">
								<spinner-item v-show="!loaded" key="spinner" class="--mini"></spinner-item>
								<img :src="paint.url" v-on:load="loaded = true" key="image">
							</transition-group>
							<span font-bold>{{ paint.name }}</span>
						</li>
					</ol>
				</section>
			</div>
		</transition>
		<transition name="fade">
			<div class="button-bottom" @click="goToRoot">
				<span class="icon-write --left"></span>
				<span class="label">Crear dibujo</span>
			</div>
		</transition>
	</article>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import SpinnerItem from './SpinnerItem';

export default {
	name: 'GalleryPage',
	data() {
		return {
			paintings: [],
			isLoading: true,
			loaded: false,
		};
	},
	components: {
		SpinnerItem,
	},
	mounted() {
		this.getAllPaintings();
	},
	methods: {
		...mapMutations([
			'setHistoryPersisted',
		]),
		getAllPaintings() {
			this.paintings = [];
			window.db.collection('painting').get().then((snapshot) => {
				snapshot.docs.forEach(painting => {
					this.paintings.push({
						id: painting.id,
						name: painting.data().name,
						email: painting.data().email,
						history: painting.data().history,
						url: painting.data().url,
					});
				});
				this.isLoading = false;
			});
		},
		goToPainting(paint) {
			this.setHistoryPersisted({
				historyPersisted: paint.history,
			})
			this.$router.push(`paint/${paint.id}`);
		},
		goToRoot() {
			this.$router.push('/');
		},
	},
};
</script>

