<template>
	<article class="p-gallery">
		<transition name="fade" mode="out-in">
			<p v-if="!isLoading && paintings.length === 0"
				block font-size-xs text-center
			>{{ $t('gallery.empty')}}</p>
			<div v-else style="width: 100%; height: 100%;">
				<FiltersBar />
				<transition name="fade" mode="out-in">
					<SpinnerItem v-if="isLoading" block margin-auto-horizontal margin-top />
					<section class="gallery-wrapper" v-else>
						<PaintingsFeed :paintings="filteredPaintings" />
					</section>
				</transition>
			</div>
		</transition>
		<GalleryActions />
	</article>
</template>
<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { getPaintings } from '@/infra/PaintingRepository';
import PaintingsFeed from '@/ui/modules/painting//PaintingsFeed';
import GalleryActions from './GalleryActions';
import FiltersBar from './FiltersBar';

export default {
	name: 'GalleryPage',
	components: {
		PaintingsFeed,
		FiltersBar,
		GalleryActions,
	},
	data() {
		return {
			paintings: [],
			isLoading: true,
		};
	},
	computed: {
		...mapState('strokes', ['history']),
		...mapState('gallery', ['paintingSelected']),
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
		async getAllPaintings() {
			try {
				this.paintings = await getPaintings();
			} catch (error) {
				showError(error);
			} finally {
				this.isLoading = false;
			}
		},
	},
};
</script>
