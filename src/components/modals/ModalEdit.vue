<template>
<modal name="modal-edit" :adaptive="true" :pivotY="0" height="auto" transition="fadeInDown">
	<span @click="$modal.hide('modal-edit')" class="icon-cross"></span>
	<h3 v-if="action === 'create'">Crear usuario</h3>
	<h3 v-if="action === 'update'">Editar usuario</h3>
	<template>
		<input type="text" placeholder="Nombre" v-model="user.name">
		<input type="text" placeholder="Email" v-model="user.email">
		<button v-if="action === 'create'" margin-top class="btn" @click="$emit('save-user', user)">Crear</button>
		<button v-if="action === 'update'" margin-top class="btn" @click="$emit('update-user', user)">Actualizar</button>
	</template>
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
