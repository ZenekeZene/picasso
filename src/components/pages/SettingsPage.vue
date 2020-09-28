<template>
	<article class="p-settings">
		<ThemeChange />
		<p class="intro" margin-bottom v-html="$t('settings.info')"></p>
		<ol class="p-settings__list">
			
			<button margin-top class="btn" @click="clearCache">{{ $t('settings.cache') }}</button>
			<button margin-top class="btn --hot" @click="$router.push({ name: 'crud' })">{{ $t('settings.admin') }}</button>
		</ol>
		<p class="credits">{{ $t('credits.created') }} <a href="https://twitter.com/zenekezene"><span font-bold>{{ $t('credits.author') }}</span></a></p>
		<GithubItem href="https://github.com/ZenekeZene/picasso#picasso" />
		<transition name="fade">
			<div class="button-floated --bottom --left" @click="$router.push({ name: 'gallery' })">
				<span class="icon-forward --left"></span>
			</div>
		</transition>
	</article>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import GithubItem from '@/components/GithubItem';
import ThemeChange from '@/components/ThemeChange';

export default {
	name: 'SettingsPage',
	components: {
		GithubItem,
		ThemeChange,
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
<style lang="scss" scoped>
.theme-toggle {
	position: absolute;
	top: 1.5rem;
	right: 1rem;
	z-index: 101;
}
</style>