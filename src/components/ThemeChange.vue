<template>
	<div
		class="theme-toggle"
		@click="toggleTheme"
		v-mobile-hover:#4992a9
		style="display: inline-block;"
	>
		<span class="icon-moon" v-if="theme === 'light'"></span>
		<span class="icon-sun" v-if="theme === 'dark'"></span>
	</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
	name: 'ThemeChange',
	computed: {
		...mapState('gallery', ['theme']),
	},
	data() {
		return {
			documentStyle: document.documentElement.style,
		};
	},
	methods: {
		...mapMutations('gallery', ['changeTheme']),
		...mapMutations('brush', ['setColorErase']),
		toggleTheme() {
			if (this.theme === 'light') {
				this.documentStyle.setProperty('--color-text', 'white');
				this.documentStyle.setProperty('--color-background', 'rgb(39, 39, 39)');
				this.setColorErase({ colorErase: 'rgb(39, 39, 39)' });
				this.changeTheme({ theme: 'dark' });
			} else {
				this.documentStyle.setProperty('--color-text', '#2c3e50');
				this.documentStyle.setProperty('--color-background', 'rgb(246, 246, 246)');
				this.setColorErase({ colorErase: 'rgb(246, 246, 246)' });
				this.changeTheme({ theme: 'light' });
			}
		},
	},
};
</script>
