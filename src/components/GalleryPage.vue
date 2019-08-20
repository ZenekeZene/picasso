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
							<vue-stars readonly :value="paint.avgRating" v-if="paint.avgRating > 0"></vue-stars>
							<span v-if="paint.avgRating === 0" text-right>Sin valoraciones</span>
						</li>
					</ol>
				</section>
			</div>
		</transition>
		<transition name="fade">
			<div class="button-floated --bottom --left" @click="goToPaint">
				<span class="icon-forward --left"></span>
			</div>
		</transition>
		<transition name="fade">
			<div class="button-floated --bottom --right"
				@click="goToCreateNewPaint"
				v-if="mode === 'read'"
				v-mobile-hover:#4992a9
			>
				<span class="label">Crear nuevo dibujo</span>
				<span class="icon-write"></span>
			</div>
		</transition>
		<transition name="fade">
		<div class="button-floated --top --right"
			@click="$router.push('settings')"
			v-mobile-hover:#4992a9
			style="z-index: 200;"
		>
			<span class="icon-cog"></span>
		</div>
	</transition>
	</article>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { VueStars } from "vue-stars";
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
		VueStars,
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
			window.db.collection('painting').get()
				.then((snapshot) => {
					snapshot.docs.forEach((doc) => {
						const data = doc.data();
						this.paintings.push({
							id: doc.id,
							name: data.name,
							email: data.email,
							history: data.history,
							url: data.url,
							avgRating: data.avgRating,
						});
					});
					this.isLoading = false;
				});
		},
		goToPainting(paint) {
			this.setPaintingSelected({ paintingSelected: paint.id });
			this.setHistory({ history: paint.history });
			setTimeout(() => {
				this.$router.push(`paint/${paint.id}`);
			}, 100);
		},
		goToPaint(event) {
			if (!event.target.classList.contains('--disabled')) {
				if (this.paintingSelected) {
					setTimeout(() => {
						this.$router.push(`paint/${this.paintingSelected}`);
					}, 100);
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
				this.setPaintingSelected({ paintingSelected: null });
			}
		},
	},
};
</script>
