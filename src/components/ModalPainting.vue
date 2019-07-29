<template>
<modal name="modal-painting" :adaptive="true" :pivotY="0" height="auto" transition="fadeInDown">
	<h1>Ponle nombre a tu dibujo</h1>
	<span @click="$modal.hide('modal-painting')" class="icon-cross"></span>
	<input type="text" placeholder="Nombre" v-model="name">
	<button margin-top class="btn" @click="$emit('sendPainting', name)">Enviar</button>
</modal>
</template>

<script>
export default {
	name: 'ModalEdit',
	data() {
		return {
			name: '',
		};
	},
};
</script>
