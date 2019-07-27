<template>
  <main class="app" :class="`page-${$route.name}`">
	<h1 class="heading">Picass<span class="icon-heart animated"
		@mouseover="easterEgg = true"
		@mouseleave="easterEgg = false"
		:class="{ 'heartBeat': easterEgg }"
	></span></h1>
	<transition name="fade" mode="out-in">
		<router-view/>
	</transition>
	<github-item href="https://github.com/ZenekeZene/picasso#picasso"></github-item>
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
			easterEgg: false,
		};
	},
};
</script>
