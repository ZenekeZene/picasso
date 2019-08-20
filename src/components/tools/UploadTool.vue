<template>
	<transition name="fade" appear>
		<div class="button-floated --bottom --right"
			@click="launchSave"
			:class="{ '--disabled': isDisabled || mode === 'read' }"
			v-mobile-hover:#4992a9
		>
			<span class="label">Guardar este dibujo</span>
			<span class="icon-save"></span>
		</div>
	</transition>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

export default {
	name: 'UploadTool',
	computed: {
		...mapState([
			'mode',
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
	},
};
</script>
