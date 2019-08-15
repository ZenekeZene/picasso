<template>
	<article class="p-settings">
		<p>Settings</p>
		<div @click="toggleTheme">
			Tema:
			<span class="icon-moon" v-if="theme === 'light'"></span>
			<span class="icon-sun" v-if="theme === 'dark'"></span>
		</div>
		<button margin-top class="btn" @click="clearCache">Borrar caché</button>
		<p>Creado por <span font-bold>Héctor Villar</span></p>
		<github-item></github-item>
		<transition name="fade">
			<div class="button-floated --bottom --left" @click="$router.push('gallery')">
				<span class="icon-forward --left"></span>
			</div>
		</transition>
	</article>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import GithubItem from './GithubItem';

export default {
	name: 'SettingsPage',
	components: {
		GithubItem,
	},
	computed: {
		...mapState([
			'theme',
		]),
	},
	methods: {
		...mapMutations([
			'changeTheme',
		]),
		toggleTheme() {
			if (this.theme === 'light') {
				document.documentElement.style.setProperty('--color-text', 'white');
				document.documentElement.style.setProperty('--color-background', 'rgb(39, 39, 39)');
				this.changeTheme({
					theme: 'dark',
				});
			} else {
				document.documentElement.style.setProperty('--color-text', '#2c3e50');
				document.documentElement.style.setProperty('--color-background', 'rgb(246, 246, 246)');
				this.changeTheme({
					theme: 'light',
				});
			}
		},
		clearCache() {
			this.$store.commit('deleteAllHistory');
			localStorage.clear();
		},
	},
};
</script>
