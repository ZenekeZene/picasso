<template>
	<article class="p-gallery">
		<transition name="fade" mode="out-in">
			<p v-if="!isLoading && paintings.length === 0"
				block font-size-xs text-center
			>{{ $t('gallery.empty')}}</p>
			<div v-else style="width: 100%; height: 100%;">
				<FiltersItem />
				<transition name="fade" mode="out-in">
					<SpinnerItem v-if="isLoading" block margin-auto-horizontal margin-top />
					<section class="gallery-wrapper" v-else>
						<ol class="gallery">
							<li
								v-for="(paint, index) in filteredPaintings"
								:key="index"
							>
								<Painting
									class="gallery__item"
									:class="{ '--selected': paintingSelected === paint.id }"
									:url="paint.url"
									:name="paint.name"
									:avgRating="paint.avgRating"
									:timestamp="paint.timestamp"
									@painting-clicked="goToPainting(paint)"
								/>
							</li>
						</ol>
					</section>
				</transition>
			</div>
		</transition>
		<transition name="fade">
			<div class="button-floated --bottom --left"
				v-if="mode === 'edit'"
				@click="backToPaint"
			>
				<span class="icon-forward --left"></span>
				<span class="label">{{ $t('gallery.back') }}</span>
			</div>
		</transition>
		<transition name="fade">
			<div
				class="button-floated --bottom --right"
				@click="goToCreateNewPainting"
				v-mobile-hover:#4992a9
			>
				<span class="label">{{ $t('gallery.create') }}</span>
				<span class="icon-write"></span>
			</div>
		</transition>
	</article>
</template>
<script>
import moment from 'moment';
import { mapState, mapMutations } from 'vuex';
import { getPaintings } from '@/infra/PaintingRepository';
import Painting from '../Painting';
import ThemeChange from '../ThemeChange';
import FiltersItem from '../FiltersItem';

export default {
	name: 'GalleryPage',
	components: {
		Painting,
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
		...mapMutations(['clearCanvas']),
		...mapMutations('status', [
			'setModeToEditable',
			'setModeToReadable',
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
		async getAllPaintings() {
			try {
				this.paintings = await getPaintings();
			} catch (error) {
				console.error(error);
				this.$toasted.show(this.$t('error.general'));
			} finally {
				this.isLoading = false;
			}
		},
		goToPainting(paint) {
			this.setModeToReadable();
			this.setPaintingSelected({ paintingSelected: paint.id });
			this.setHistory({ history: paint.history });
			this.$router.push({ name: 'paintById', params: { paintId: paint.id }});
		},
		backToPaint(event) {
			if (!event.target.classList.contains('--disabled')) {
				if (this.paintingSelected) {
					this.$router.push({ name: 'paintById', params: { paintId: this.paintingSelected }});
				} else {
					this.$router.push({ name: 'paint' });
				}
			}
		},
		goToCreateNewPainting(event) {
			if (!event.target.classList.contains('--disabled')) {
				this.$router.push({ name: 'paint' });
				this.setModeToEditable();
				this.deleteAllHistory();
				this.resetIndexLine();
				this.setPaintingSelected({ paintingSelected: null });
			}
		},
	},
};
</script>
