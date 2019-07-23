<template>
  <main class="app">
	<h1 class="heading">Painter</h1>
    <router-view/>
	<github-item href="https://github.com/ZenekeZene/paint.git"></github-item>
  </main>
</template>

<script>
import GithubItem from './components/GithubItem';

export default {
	name: 'App',
	components: {
		GithubItem,
	},
};
</script>
