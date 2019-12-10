<template>
    <p>{{ brush }}</p>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
    name: 'BrushItem',
    computed: {
        ...mapState([
			'brush'
		]),
    },
    methods: {

    },
};
</script>