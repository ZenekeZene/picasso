<template>
<modal
	name="modal-edit"
	:adaptive="true"
	:pivotY="0"
	height="auto"
	transition="fadeInDown"
>
	<div padding>
		<span @click="$modal.hide('modal-edit')" class="icon-cross"></span>
		<h3 v-if="action === 'create'">{{ $t('crud.create-user') }}</h3>
		<h3 v-if="action === 'update'">{{ $t('crud.edit-user') }}</h3>
		<template>
			<input type="text" placeholder="Nombre" v-model="user.name">
			<input type="text" placeholder="Email" v-model="user.email">
			<button
				v-if="action === 'create'" margin-top class="btn"
				@click="$emit('save-user', user)"
			>{{ $t('crud.create') }}</button>
			<button
				v-if="action === 'update'" margin-top class="btn"
				@click="$emit('update-user', user)"
			>{{ $t('crud.update') }}</button>
		</template>
	</div>
</modal>
</template>

<script>
export default {
	name: 'ModalEdit',
	props: {
		action: {
			type: String,
			default: 'create',
		},
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
