<template>
	<article class="p-settings">
		<p class="intro" margin-bottom>Pocas cosas para <span font-bold>configurar</span>, amigo.</p>
		<ol class="p-settings__list">
			
			<button margin-top class="btn" @click="clearCache">Borrar caché</button>
			<button margin-top class="btn --hot">Administrar</button>
		</ol>
		<p class="credits">Creado por <span font-bold>Héctor Villar</span></p>
		<github-item href="https://github.com/ZenekeZene/picasso#picasso"></github-item>
		<transition name="fade">
			<div class="button-floated --bottom --left" @click="$router.push('gallery')">
				<span class="icon-forward --left"></span>
			</div>
		</transition>
	</article>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import GithubItem from '../GithubItem';

export default {
	name: 'SettingsPage',
	components: {
		GithubItem,
	},
	computed: {
		...mapState('gallery', ['theme']),
	},
	methods: {
		...mapMutations('gallery', ['changeTheme']),
		...mapMutations('strokes', ['deleteAllHistory']),
		...mapMutations('brush', ['setColorErase']),
		toggleTheme() {
			if (this.theme === 'light') {
				document.documentElement.style.setProperty('--color-text', 'white');
				document.documentElement.style.setProperty('--color-background', 'rgb(39, 39, 39)');
				this.setColorErase({ colorErase: 'rgb(39, 39, 39)' });
				this.changeTheme({ theme: 'dark' });
			} else {
				document.documentElement.style.setProperty('--color-text', '#2c3e50');
				document.documentElement.style.setProperty('--color-background', 'rgb(246, 246, 246)');
				this.setColorErase({ colorErase: 'rgb(246, 246, 246)' });
				this.changeTheme({ theme: 'light' });
			}
		},
		clearCache() {
			this.deleteAllHistory();
			localStorage.clear();
			location.reload();
		},
	},
};
</script>
