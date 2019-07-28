<template>
  <main class="app" :class="`page-${$route.name}`">
	<h1 class="heading"
		transition
		:class="{ '--disabled': isPainting }"
	>Picass<span class="icon-heart animated"
		v-mobile-hover:#4992a9="'heartBeat'"
	></span></h1>
	<transition name="fade" mode="out-in">
		<router-view @isPainting="isPainting = $event" />
	</transition>
	<github-item href="https://github.com/ZenekeZene/picasso#picasso"
		transition
		:class="{ '--disabled': isPainting }"
	></github-item>
  </main>
</template>

<script>
import GithubItem from './components/GithubItem';

export default {
	name: 'App',
	components: {
		GithubItem,
	},
	data() {
		return {
			isPainting: false,
		};
	},
};
</script>
