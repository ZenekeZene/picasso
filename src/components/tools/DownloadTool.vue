<template>
	<li class="tools__item" :class="{ '--disabled': isDisabled }">
		<a :href="dataURI" download="my-awesome-drawing-of-painter">
			<span class="icon-printer"></span>
		</a>
		<span class="label">Download</span>
	</li>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
	name: 'DownloadTool',
	computed: {
		...mapGetters([
			'isDisabled',
		]),
	},
	props: {
		dataURI: {
			type: String,
			default: '',
		},
	},
}
</script>
