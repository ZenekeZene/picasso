<template>
	<li class="tools__item" v-if="mode === 'edit'">
		<span class="icon-upload"
			@click="launchSave"
			v-mobile-hover:#4992a9
			:class="{ '--disabled': isDisabled || mode === 'read' }"
		></span>
		<span class="label">Upload</span>
		<modal-painting @sendPainting="save"></modal-painting>
	</li>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import ModalPainting from '../modals/ModalPainting';

export default {
	name: 'UploadTool',
	components: {
		ModalPainting,
	},
	computed: {
		...mapState([
			'mode',
			'canvas',
			'history',
		]),
		...mapGetters([
			'isDisabled',
		]),
	},
	methods: {
		launchSave(event) {
			if (!event.target.classList.contains('--disabled')) {
				this.$modal.show('modal-painting');
			}
		},
		save(paintingData) {
			this.getCanvasBlob().then((blob) => {
				const metadata = {
					contentType: 'image/png',
				};
				this.$emit('showSpinner', { status: true });
				window.storage.ref().child(`images/${Math.floor(Date.now() / 1000)}`).put(blob, metadata).then((snapshot) => {
					snapshot.ref.getDownloadURL().then((url) => {
						window.db
							.collection('painting')
							.add({
								name: paintingData.name,
								history: JSON.stringify(this.history),
								url,
								avgRating: 0,
								numRatings: 0,
								timestamp: new Date(),
							})
							.then(() => {
								this.$toasted.show('Dibujo subido con éxito!');
								this.$emit('showSpinner', { status: false });
							})
							.catch(() => {
								this.$toasted.show('Ha surgido un error!');
								this.$emit('showSpinner', { status: false });
							});
					});
				})
				.catch(() => {
					this.$toasted.show('Ha surgido un error!');
					this.$emit('showSpinner', { status: false });
				});
			});

			this.$modal.hide('modal-painting');
		},
		getCanvasBlob() {
			return new Promise((resolve) => {
				this.canvas.toBlob((blob) => {
					resolve(blob);
				});
			});
		},
	},
};
</script>
