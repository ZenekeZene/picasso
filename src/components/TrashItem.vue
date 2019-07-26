<template>
	<span ref="items-trash"
		class="paint__trash icon-trash"
		v-show="isVisible"
	></span>
</template>

<script>
import interact from 'interactjs';

export default {
	name: 'TrashItem',
	props: {
		isVisible: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		interact(this.$el)
			.dropzone({
				accept: '.draggable',
				ondrop: (event) => {
					event.target.classList.remove('--hot');
					this.$emit('ondrop', event.relatedTarget);
				},
				ondragenter: (event) => {
					event.target.classList.add('--hot');
				},
				ondragleave: (event) => {
					event.target.classList.remove('--hot');
				}
			})
			.on('dropactivate', (event) => {
				event.target.classList.add('drop-activated');
			});
	}
}
</script>

