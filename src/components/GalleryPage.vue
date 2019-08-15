<template>
	<article class="p-gallery">
		<p class="intro">Dibujos
			<span font-bold>anónimos</span> de gente <span font-bold>muy loca</span>.
		</p>
		<transition name="fade" mode="out-in">
			<p v-if="!isLoading && paintings.length === 0"
				block font-size-xs text-center
			>[ &nbsp;Aún no hay dibujos&nbsp;&nbsp;<span font-size-l>🥺</span>&nbsp; ]</p>
			<div v-else style="width: 100%; height: 100%;">
				<spinner-item v-if="isLoading" block margin-auto-horizontal margin-top></spinner-item>
				<section class="gallery-wrapper">
					<ol class="gallery">
						<li class="gallery__item"
							v-for="paint in paintings"
							:key="paint.id"
							@click="goToPainting(paint)"
							:class="{ '--selected': paintingSelected === paint.id }"
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
			<div class="button-bottom" @click="goToPaint">
				<span class="icon-forward --left"></span>
			</div>
		</transition>
		<transition name="fade">
			<div class="button-bottom --right"
				@click="goToCreateNewPaint"
				v-if="mode === 'read'"
			>
				<span class="label">Crear nuevo dibujo</span>
				<span class="icon-write --left"></span>
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
	computed: {
		...mapState([
			'history',
			'mode',
			'paintingSelected',
		]),
		backLiteral() {
			return this.history.length > 0 && this.mode === 'edit' ?
				'Seguir con mi dibujo' :
				'Crear dibujo nuevo';
		},
	},
	mounted() {
		this.getAllPaintings();
	},
	methods: {
		...mapMutations([
			'setHistory',
			'setModeToEditable',
			'deleteAllHistory',
			'resetIndexLine',
			'clearCanvas',
			'setPaintingSelected',
		]),
		getAllPaintings() {
			this.paintings = [];
			window.db.collection('painting').get().then((snapshot) => {
				snapshot.docs.forEach((painting) => {
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
			this.setPaintingSelected({
				paintingSelected: paint.id,
			});
			this.setHistory({
				history: paint.history,
			});
			setTimeout(() => {
				this.$router.push(`paint/${paint.id}`);
			}, 100);
		},
		goToPaint(event) {
			if (!event.target.classList.contains('--disabled')) {
				if (this.mode === 'read') {
					this.$router.back();
				} else {
					this.$router.push('/');
				}
			}
		},
		goToCreateNewPaint(event) {
			if (!event.target.classList.contains('--disabled')) {
				this.$router.push('/');
				this.setModeToEditable();
				this.deleteAllHistory();
				this.resetIndexLine();
				this.clearCanvas();
				this.setPaintingSelected({
					paintingSelected: null,
				});
			}
		},
	},
};
</script>
