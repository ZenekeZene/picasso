<template>
<main class="app" :class="`page-${$route.name}`">
	<transition name="fade" mode="out-in">
		<h1 class="heading"
			:class="{ '--disabled': isPainting }"
			v-if="$route.name!='gallery'"
			key="no-gallery"
		>{{ $t('name') }}</h1>
		<h1 class="heading"
			:class="{ '--disabled': isPainting }"
			v-else
			key="gallery"
		>{{ $t('gallery.title') }}</h1>
	</transition>
	<div class="options">
		<span class="settings icon-cog"
			v-if="$route.name == 'gallery'"
			@click="$router.push({ name: 'settings' })"
		></span>
	</div>
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

export default {
	name: 'App',
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
<style lang="scss" scoped>
.options {
	position: absolute;
	top: 1.5rem;
	right: 1rem;
	z-index: 101;
	display: inline-flex;
}
</style>