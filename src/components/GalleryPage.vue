<template>
	<article class="p-gallery">
		<h5 margin-zero margin-auto-horizontal>Galería</h5>
		<p v-if="paintings.length === 0" margin-top block font-size-xs text-center>Aún no hay dibujos.</p>
		<section class="gallery-wrapper">
			<ol class="gallery">
				<li class="gallery__item"
					v-for="paint in paintings"
					:key="paint.id"
					@click="$router.push(`paint/${paint.id}`)"
				>
					<img :src="paint.url">
					<span font-bold>{{ paint.name }}</span>
				</li>
			</ol>
		</section>
		<transition name="fade">
			<span class="button-bottom icon-forward --left" @click="$router.push('/')"></span>
		</transition>
	</article>
</template>
<script>
export default {
	name: 'GalleryPage',
	data() {
		return {
			paintings: [],
		};
	},
	mounted() {
		this.getAllPaintings();
	},
	methods: {
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
			});
		},
	},
};
</script>

