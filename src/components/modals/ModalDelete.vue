<template>
<modal
	name="modal-delete"
	:adaptive="true"
	:pivotY="0"
	height="auto"
	transition="fadeInDown"
>
	<span @click="$modal.hide('modal-delete')" class="icon-cross"></span>
	<div padding>
		<h3 class="--hot">{{ $t('crud.delete-user') }}</h3>
		<p>{{ $t('crud.question') }}</p>
		<p font-bold margin-zero padding-left>{{ user.name }}</p>
		<p font-bold padding-left>{{ user.email }}</p>
		<button margin-top-2 class="btn --hot"
			@click="$emit('delete-user', user)"
		>{{ $t('crud.delete-user') }}</button>
	</div>
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

