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
import { mapState, mapGetters, } from 'vuex';
import ModalPainting from '../ModalPainting';

export default {
	name: 'UploadTool',
	components: {
		ModalPainting,
	},
	computed: {
		...mapState([
			'mode',
			'canvas',
			'historyPersisted',
		]),
		...mapGetters([
			'isDisabled',
		]),
	},
	methods: {
		launchSave() {
			this.$modal.show('modal-painting');
		},
		save(paintingData) {
			this.getCanvasBlob().then((blob) => {
				const metadata = {
					'contentType': 'image/png'
				};
				window.storage.ref().child(`images/${Math.floor(Date.now() / 1000)}`).put(blob, metadata).then((snapshot) => {
					console.log('Uploaded', snapshot.totalBytes, 'bytes.');
					snapshot.ref.getDownloadURL().then((url) => {
						window.db
							.collection('painting')
							.add({
								name: paintingData.name,
								history: JSON.stringify(this.historyPersisted),
								url: url,
							})
							.then(() => {
								this.$toasted.show('Dibujo subido con éxito!');
							});
					});
				}).catch((error) => {
					console.error('Upload failed:', error);
				});
			});
		
			this.$modal.hide('modal-painting');
		},
		getCanvasBlob() {
			return new Promise((resolve, reject) => {
				this.canvas.toBlob((blob) => {
					resolve(blob);
				});
			});
		},
	},
};
</script>