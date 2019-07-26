<template>
	<p contenteditable="true" class="text draggable"
	v-touch:longtap="longtap"></p>
</template>
<script>
export default {
	name: 'TextInput',
	methods: {
		longtap() {
			alert('longtap');
		},
	},
}
</script>
