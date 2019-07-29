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
<style lang="scss" scoped>
.github {
	position: absolute;
	right: 0;
	bottom: 0;

	&:before {
		content: '';
		$size: 6rem;
		position: absolute;
		right: 0;
		bottom: -$size;
		width: 0;
		height: 0;
		border-top: $size solid transparent;
		border-bottom: $size solid transparent;
		border-right: $size solid;
		border-right-color: #2c3e50;
	}

	img {
		width: 2rem;
		margin: 0.33rem 0.5rem;
		filter: invert(1);
		transition: margin 250ms ease-in;
	}

	&:hover img {
		margin-bottom: 0.5rem;
	}

	.cta {
		position: absolute;
		top: 0;
		left: 0;
		font-weight: 900;
		transform: rotate(-45deg);
		opacity: 0;
		font-size: 0.5rem;
		transition: all 250ms ease-in;
	}

	&:hover .cta {
		top: -1.2rem;
		left: -2.5rem;
		opacity: 1;
		font-size: initial;
	}
}
</style>
