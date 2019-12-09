<template>
	<article class="p-gallery">
		<transition name="fade" mode="out-in">
			<p v-if="!isLoading && paintings.length === 0" block font-size-xs text-center>
				[ &nbsp;Aún no hay dibujos&nbsp;&nbsp;
				<span font-size-l>🥺</span>&nbsp; ]
			</p>
			<div v-else style="width: 100%; height: 100%;">
				<filters-item></filters-item>
				<transition name="fade" mode="out-in">
					<spinner-item v-if="isLoading" block margin-auto-horizontal margin-top></spinner-item>
					<section class="gallery-wrapper" v-else>
						<ol class="gallery">
							<li
								class="gallery__item"
								v-for="paint in filteredPaintings"
								:key="paint.id"
								@click="goToPainting(paint)"
								:class="{ '--selected': paintingSelected === paint.id }"
							>
								<spinner-item v-show="!loaded" key="spinner" class="spinner --mini"></spinner-item>
								<div style="min-width: 47px;">
									<img :src="paint.url" v-on:load="loaded = true" key="image" />
								</div>
								<span class="name">{{ paint.name }}</span>
								<div class="rating">
									<star-rating
										:rating="paint.avgRating"
										:star-size="15"
										:padding="3"
										:glow="0"
										:rounded-corners="true"
										:border-width="0"
										:increment="0.5"
										:fixed-points="2"
										:show-rating="false"
										:round-start-rating="false"
										:read-only="true"
									></star-rating>
									<span>Creado {{ calculateMoment(paint.timestamp) }}</span>
								</div>
							</li>
						</ol>
					</section>
				</transition>
			</div>
		</transition>
		<transition name="fade">
			<div class="button-floated --bottom --left" @click="goToPaint" v-if="mode === 'edit'">
				<span class="icon-forward --left"></span>
				<span class="label">Seguir dibujando</span>
			</div>
		</transition>
		<transition name="fade">
			<div
				class="button-floated --bottom --right"
				@click="goToCreateNewPaint"
				v-mobile-hover:#4992a9
			>
				<span class="label">Crear nuevo dibujo</span>
				<span class="icon-write"></span>
			</div>
		</transition>
	</article>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import moment from 'moment';
import StarRating from 'vue-star-rating';
import SpinnerItem from '../SpinnerItem';
import ThemeChange from '../ThemeChange';
import FiltersItem from '../FiltersItem';

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
		StarRating,
		FiltersItem,
		ThemeChange,
	},
	computed: {
		...mapState([
			'history',
			'mode',
			'paintingSelected',
			'filterCriterion',
		]),
		filteredPaintings() {
			const compare = {
				alphabet: (a, b) => (a.name.localeCompare(b.name)),
				rating: (a, b) => (a.avgRating > b.avgRating ? -1 : 0),
				date: (a, b) => (a.timestamp > b.timestamp ? -1 : 0),
			};

			return Array.prototype.slice.call(this.paintings).sort(compare[this.filterCriterion]);
		},
	},
	mounted() {
		moment.locale('es');
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
			'setFilterCriterion',
		]),
		calculateMoment(timestamp) {
			return moment(new Date(timestamp.seconds * 1000)).fromNow();
		},
		getAllPaintings() {
			this.paintings = [];
			window.db
				.collection('painting')
				.get()
				.then((snapshot) => {
					snapshot.docs.forEach((doc) => {
						const data = doc.data();
						this.paintings.push({
							id: doc.id,
							name: data.name,
							history: data.history,
							url: data.url,
							avgRating: data.avgRating,
							timestamp: data.timestamp,
						});
					});
					this.isLoading = false;
				});
		},
		goToPainting(paint) {
			this.setPaintingSelected({ paintingSelected: paint.id });
			this.setHistory({ history: paint.history });
			this.$router.push(`/paint/${paint.id}`);
		},
		goToPaint(event) {
			if (!event.target.classList.contains('--disabled')) {
				if (this.paintingSelected) {
					this.$router.push(`paint/${this.paintingSelected}`);
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
				this.setPaintingSelected({ paintingSelected: null });
			}
		},
	},
};
</script>
