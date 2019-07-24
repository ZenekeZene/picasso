<template>
  <main class="app">
	<h1 class="heading">Picass<span class="icon-heart animated" @mouseover="easterEgg = true" @mouseleave="easterEgg = false" :class="{'heartBeat': easterEgg}"></span></h1>
    <router-view/>
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
