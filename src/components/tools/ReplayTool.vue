<template>
	<li class="tools__item">
		<span
			:class="{
				'icon-stop': isPlaying,
				'icon-play': !isPlaying ,
				'--playing': isPlaying,
				'--disabled': isPauseDisabled }"
			v-touch:end="replay"
			v-mobile-hover:#4992a9
		></span>
		<span class="label" v-if="!isPlaying">Replay</span>
		<span class="label" v-else>Stop</span>
	</li>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
	name: 'ReplayTool',
	computed: {
		...mapState([
			'isPlaying',
		]),
		...mapGetters([
			'isPauseDisabled',
		]),
	},
	methods: {
		replay(event) {
			if (!event.target.classList.contains('--disabled')) {
				this.$emit('replay');
			}
		},
	},
};
</script>
