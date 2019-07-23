<template>
	<a class="github" :href="href" target="_BLANK">
		<img src="static/github.png" alt="Github logo">
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
