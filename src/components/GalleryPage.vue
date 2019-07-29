<template>
	<section class="gallery">
		<ol class="list">
			<li class="list__item"
				v-for="paint in paintings" :key="paint.id" @click="$router.push(`paint/${paint.id}`)">
				<span font-bold margin-right>{{ paint.name }}</span>
			</li>
		</ol>
		<transition name="fade">
			<span class="button-bottom icon-forward --left" @click="$router.push('/')"></span>
		</transition>
	</section>
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
				console.log(snapshot.docs);
				snapshot.docs.forEach(painting => {
					this.paintings.push({
						id: painting.id,
						name: painting.data().name,
						history: painting.data().history,
					});
				});
			});
		},
	},
};
</script>

