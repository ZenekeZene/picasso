<template>
	<a class="github" :href="href" target="_BLANK">
		<img src="static/github.png" alt="Github logo">
		<span class="cta">Fork me!</span>
	</a>
</template>

<script>
	export default {
		name: 'GithubItem',
		props: {
			href: {
				type: String,
				default: '#',
			},
		},
	};
</script>
