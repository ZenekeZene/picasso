import { mapState } from 'vuex';

const controlInput = {
    computed: {
        ...mapState(['mode', 'isPainting', 'isPlaying']),
    },
    methods: {
        inputDown(event, callback) {
            if (this.mode === 'edit') {
                this.$emit('mouseDown', { status: false });
            }

            if (!this.isPainting && !this.isPlaying && this.mode === 'edit') {
                this.setPaintingStatus({ status: true });
                this.createNewStrokeOnHistory();
                callback();
            }
        },
        inputMove(event, callback) {
            if (!this.isEditingMode()) return false;
			callback();
            return true;
        },
        inputUp() {
            if (!this.isEditingMode()) return false;
            this.setPaintingStatus({ status: false });
            this.incrementIndexLine();
            this.$emit('mouseup', false);
            return true;
        },
        getCoordinates(event) {
            let offsetX;
            let offsetY;
            if (event.offsetX) {
                ({ offsetX, offsetY } = event);
            } else {
                offsetX = event.touches[0].clientX;
                offsetY = event.touches[0].clientY;
            }
            return { offsetX, offsetY };
        },
        isEditingMode() {
            return this.isPainting && !this.isPlaying && this.mode === 'edit';
        },
    },
};

export default controlInput;
