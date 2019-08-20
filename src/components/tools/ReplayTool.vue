<template>
	<li class="tools__item">
		<span
			:class="{
				'icon-stop': isPlaying,
				'icon-play': !isPlaying ,
				'--playing': isPlaying,
				'--disabled': isPauseDisabled }"
			v-touch:end="launchReplay"
			v-mobile-hover:#4992a9
		></span>
		<span class="label" v-if="!isPlaying">Replay</span>
		<span class="label" v-else>Stop</span>
	</li>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import PlayerDot from '../PlayerDot.mixin';

export default {
	name: 'ReplayTool',
	mixins: [
		PlayerDot,
	],
	computed: {
		...mapState([
			'isPlaying',
			'paintingSelected',
		]),
		...mapGetters([
			'isPauseDisabled',
		]),
	},
	mounted() {
		this.setPaintingSelected({ paintingSelected: this.$route.params.id });
		
		if (this.paintingSelected) {
			this.$emit('showSpinner', { status : true });
			this.getHistoryOfPainting({ paintingId: this.paintingSelected })
			.then((data) => {
				this.$emit('showSpinner', { status : false });
				this.replay();
				this.setModeToReadable();
			})
			.catch((error) => {
				console.error(error);
				this.$toasted.show('Ha surgido un error!');
				this.$emit('showSpinner', { status : false });
			});
		}
	},
	methods: {
		...mapMutations([
			'setPaintingSelected',
			'setModeToReadable',
			'setPlayingStatus',
			'clearCanvas',
		]),
		...mapActions([
			'getHistoryOfPainting',
		]),
		launchReplay(event) {
			if (!event.target.classList.contains('--disabled')) {
				this.replay();
			}
		},
		replay(interval = 10) {
			if (!this.isPlaying) {
				this.setPlayingStatus({ status: true });
				this.clearCanvas();
				const history = [].concat(...this.history);
				this.loop(
					0,
					history.length,
					(i) => {
						this.paintDot(history[i]);
					},
					() => {
						this.setPlayingStatus({ status: false });
					},
					interval
				);
			} else {
				clearTimeout(this.loopTimer);
				this.setPlayingStatus({ status: false });
				this.player();
			}
		},
		loop(index, howManyTimes, f, callback, ms) {
			let i = index;
			f(i);
			i += 1;
			if (i < howManyTimes) {
				this.loopTimer = setTimeout(() => {
					this.loop(i, howManyTimes, f, callback, ms);
				}, ms);
			} else {
				callback();
			}
		},
	},
};
</script>
