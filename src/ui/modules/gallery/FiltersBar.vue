<template>
	<div class="filters">
		<span class="label">{{ $t('filter') }}:</span>
		<ul class="filters__list">
			<li
				@click="setFilter('alphabet')"
				:class="{ '--active': filterCriterion === 'alphabet' }"
			>
				<span class="icon-sort-alphabetically"></span>
			</li>
			<li
				@click="setFilter('rating')"
				:class="{ '--active': filterCriterion === 'rating' }"
			>
				<span class="icon-star-full"></span>
			</li>
			<li
				@click="setFilter('date')"
				:class="{ '--active': filterCriterion === 'date' }"
			>
				<span class="icon-clock"></span>
			</li>
		</ul>
	</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export function sort(paintings, criterion) {
	const compare = {
		alphabet: (a, b) => (a.name.localeCompare(b.name)),
		rating: (a, b) => (a.avgRating > b.avgRating ? -1 : 0),
		date: (a, b) => (a.timestamp > b.timestamp ? -1 : 0),
	};
	return paintings.sort(compare[criterion]);
}

export default {
	name: 'FiltersItem',
	computed: {
		...mapState('gallery', ['filterCriterion']),
	},
	methods: {
		...mapMutations('gallery', ['setFilterCriterion']),
		setFilter(criterion = 'date') {
			this.setFilterCriterion({ filterCriterion: criterion });
		},
	},
};
</script>
