<template>
  <main class="app" :class="`page-${$route.name}`">
	<h1 class="heading"
		transition
		:class="{ '--disabled': isPainting }"
	>Picass<span class="icon-heart animated"
		v-mobile-hover:#4992a9="'heartBeat'"
	></span></h1>
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
		...mapState([
			'isPainting',
			'theme',
		]),
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
