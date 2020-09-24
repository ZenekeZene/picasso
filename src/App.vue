<template>
<main class="app" :class="`page-${$route.name}`">
	<transition name="fade" mode="out-in">
		<h1 class="heading"
			:class="{ '--disabled': isPainting }"
			v-if="$route.name!='gallery'"
			key="no-gallery"
		>Picasso</h1>
		<h1 class="heading"
			:class="{ '--disabled': isPainting }"
			v-else
			key="gallery"
		>Libro de firmas</h1>
	</transition>
	<theme-change v-if="$route.name == 'gallery'"></theme-change>

	<transition name="fade" mode="out-in">
		<router-view
			@isPainting="isPainting = $event"
			@inputFocused="anyInputFocused = $event"
		/>
	</transition>
</main>
</template>

<script>
import { mapState } from 'vuex';
import ThemeChange from './components/ThemeChange';

export default {
	name: 'App',
	components: {
		ThemeChange,
	},
	computed: {
		...mapState('status', ['isPainting']),
		...mapState('gallery', ['theme']),
		title() {
			return this.$route.name === 'gallery' ? 'Galería' : 'Picasso';
		},
	},
	data() {
		return {
			anyInputFocused: false,
		};
	},
	created() {
		if (this.theme === 'dark') {
			document.documentElement.style.setProperty('--color-text', 'white');
			document.documentElement.style.setProperty('--color-background', 'rgb(39, 39, 39)');
		} else {
			document.documentElement.style.setProperty('--color-text', '#2c3e50');
			document.documentElement.style.setProperty('--color-background', 'rgb(246, 246, 246)');
		}
	},
};
</script>
