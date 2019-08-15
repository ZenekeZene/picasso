<template>
	<li class="tools__item" :class="{ '--disabled': isDisabled }">
		<a :href="downloadURI" download="my-awesome-drawing-of-painter">
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
		downloadURI: {
			type: String,
			default: '',
		},
	},
};
</script>
