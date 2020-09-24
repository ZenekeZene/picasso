<template>
	<li class="tools__item" :class="{ '--disabled': isDisabled }">
		<span class="icon-printer"></span>
		<a v-if="!isDisabled"
			class="download"
			:href="downloadURI"
			download="my-awesome-drawing-of-painter"
		></a>
		<span class="label">Download</span>
	</li>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
	name: 'DownloadTool',
	computed: {
		...mapGetters('status', ['isDisabled']),
	},
	props: {
		downloadURI: {
			type: String,
			default: '',
		},
	},
};
</script>
