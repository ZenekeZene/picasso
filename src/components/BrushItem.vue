<template></template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
    name: 'BrushItem',
    computed: {
        ...mapState([
			'brush'
		]),
    },
};
</script>