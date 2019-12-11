<template>
	<li ref="item"
		class="tools__item"
		:class="{ '--disabled': isPauseDisabled }"
		v-touch:end="launchReplay"
		v-mobile-hover:#4992a9
	>
		<span
			:class="{
				'icon-stop': isPlaying,
				'icon-play': !isPlaying ,
				'--playing': isPlaying,
			}"
		></span>
		<span class="label" v-if="!isPlaying">Replay</span>
		<span class="label" v-else>Stop</span>
	</li>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import PlayerDot from '../../mixins/PlayerDot.mixin';
import { RegularBrush, NeighbourBrush } from '../../brushes/Brushes';
import Dot from '../../entities/Dot';

export default {
	name: 'ReplayTool',
	mixins: [
		PlayerDot,
	],
	computed: {
		...mapState([
			'isPlaying',
			'paintingSelected',
			'brushSelected',
		]),
		...mapGetters([
			'isPauseDisabled',
		]),
	},
	data() {
        return {
            currentBrush: null,
        };
    },
	mounted() {
		this.setPaintingSelected({ paintingSelected: this.$route.params.id });

		if (this.paintingSelected) {
			this.$emit('showSpinner', { status: true });
			this.deleteAllHistory();
			this.getHistoryOfPainting({ paintingId: this.paintingSelected })
			.then(({ history }) => {
				this.setHistoryOfPainting({ raw: history });
				this.$emit('showSpinner', { status: false });
				this.replay();
				this.setModeToReadable();
			})
			.catch((error) => {
				console.error(error);
				this.$toasted.show('Ha surgido un error!');
				this.$emit('showSpinner', { status: false });
			});
		}
	},
	methods: {
		...mapMutations([
			'setPaintingSelected',
			'setModeToReadable',
			'setPlayingStatus',
			'clearCanvas',
			'deleteHistory',
			'deleteAllHistory',
			'setHistoryOfPainting',
			'changeBrush',
		]),
		...mapActions([
			'getHistoryOfPainting',
		]),
		launchReplay() {
			if (!this.$refs.item.classList.contains('--disabled')) {
				this.replay();
			}
		},
		replay(interval = 10) {
			if (!this.isPlaying) {
				this.setPlayingStatus({ status: true });
				this.clearCanvas();
				const history = [].concat(...this.history);
				this.changeBrush({ brushSelected: NeighbourBrush.name });
				if (this.brushSelected === NeighbourBrush.name) {
					this.currentBrush = new NeighbourBrush({
						ctx: this.ctx,
						theme: this.theme,
					});
				}
				this.currentBrush.replay(this.history);

				/*this.loop(
					0,
					history.length,
					(i) => {
						const dot = new Dot(history[i]);
						this.paintDot(dot);
					},
					() => {
						this.setPlayingStatus({ status: false });
					},
					interval,
				);*/
			} else {
				clearTimeout(this.loopTimer);
				this.setPlayingStatus({ status: false });
				this.player(this.history);
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
