<template>
<modal name="modal-delete" :adaptive="true" :pivotY="0" height="auto" transition="fadeInDown">
	<span @click="$modal.hide('modal-delete')" class="icon-cross"></span>
	<h3 class="--hot">Borrar usuario</h3>
	<p>¿De verdad quieres borrar el siguiente usuario?</p>
	<p font-bold margin-zero padding-left>{{ user.name }}</p>
	<p font-bold padding-left>{{ user.email }}</p>
	<button margin-top-2 class="btn --hot" @click="$emit('deleteUser', user)">Borrar usuario</button>
</modal>
</template>

<script>
export default {
	name: 'ModalDelete',
	props: {
		user: {
			type: Object,
			default: () => {
				return {
					name: '',
					email: ''
				};
			},
		},
	},
};
</script>

