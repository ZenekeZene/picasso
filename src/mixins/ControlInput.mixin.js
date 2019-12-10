import { mapState } from 'vuex';

const controlInput = {
    computed: {
        ...mapState(['mode', 'isPainting', 'isPlaying']),
    },
    methods: {
        async inputDown() {
            return new Promise((resolve, reject) => {
                if (this.mode !== 'edit' || this.isPainting || this.isPlaying) return reject();
                this.$emit('mouseDown', { status: false });
                this.setPaintingStatus({ status: true });
                this.createNewStrokeOnHistory();
                return resolve();
            });
        },
        async inputMove() {
            return new Promise((resolve, reject) => {
                if (!this.isEditingMode()) return reject();
                return resolve();
            });
        },
        async inputUp() {
            return new Promise((resolve, reject) => {
                if (!this.isEditingMode()) return reject();
                this.setPaintingStatus({ status: false });
                this.incrementIndexLine();
                this.$emit('mouseup', false);
                return resolve();
            });
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
