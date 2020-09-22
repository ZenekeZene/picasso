<template>
	<article class="p-gallery">
		<transition name="fade" mode="out-in">
			<p v-if="!isLoading && paintings.length === 0" block font-size-xs text-center>
				&nbsp;Aún no ha firmado nadie. ¿Quieres ser el primero?&nbsp;&nbsp;
				<span font-size-l>🥺</span>&nbsp;
			</p>
			<div v-else style="width: 100%; height: 100%;">
				<FiltersItem />
				<transition name="fade" mode="out-in">
					<SpinnerItem v-if="isLoading" block margin-auto-horizontal margin-top />
					<section class="gallery-wrapper" v-else>
						<ol class="gallery">
							<li
								v-for="paint in filteredPaintings"
								:key="paint.id"
							>
								<Drawing
									class="gallery__item"
									:class="{ '--selected': paintingSelected === paint.id }"
									:url="paint.url"
									:name="paint.name"
									:avgRating="paint.avgRating"
									:timestamp="paint.timestamp"
									@drawing-clicked="goToPainting(paint)"
								/>
							</li>
						</ol>
					</section>
				</transition>
			</div>
		</transition>
		<transition name="fade">
			<div class="button-floated --bottom --left" @click="backToPaint" v-if="mode === 'edit'">
				<span class="icon-forward --left"></span>
				<span class="label">Seguir firmando</span>
			</div>
		</transition>
		<transition name="fade">
			<div
				class="button-floated --bottom --right"
				@click="goToCreateNewPaint"
				v-mobile-hover:#4992a9
			>
				<span class="label">Crear nueva firma</span>
				<span class="icon-write"></span>
			</div>
		</transition>
	</article>
</template>
<script>
import moment from 'moment';
import { mapState, mapMutations } from 'vuex';
import Drawing from '../Drawing';
import SpinnerItem from '../SpinnerItem';
import ThemeChange from '../ThemeChange';
import FiltersItem from '../FiltersItem';

export default {
	name: 'GalleryPage',
	components: {
		Drawing,
		SpinnerItem,
		FiltersItem,
		ThemeChange,
	},
	data() {
		return {
			paintings: [],
			isLoading: true,
		};
	},
	computed: {
		...mapState(['mode']),
		...mapState('strokes', ['history']),
		...mapState('gallery', [
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
			'setModeToEditable',
			'setModeToReadable',
			'clearCanvas',
		]),
		...mapMutations('strokes', [
			'setHistory',
			'deleteAllHistory',
			'resetIndexLine',
		]),
		...mapMutations('gallery', [
			'setPaintingSelected',
			'setFilterCriterion',
		]),
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
			this.setModeToReadable();
			this.setPaintingSelected({ paintingSelected: paint.id });
			this.setHistory({ history: paint.history });
			this.$router.push(`/paint/${paint.id}`);
		},
		backToPaint(event) {
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
