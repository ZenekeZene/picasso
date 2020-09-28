export default {
  state: {
    mode: 'edit',
    isPlaying: false,
		isPainting: false,
		toolsVisible: false,
  },
  getters: {
    isDisabled: ({ isPainting, isPlaying }, getters, { strokes }) =>
      isPlaying || isPainting || strokes.history.length === 0,
  },
  mutations: {
    setModeToEditable(state) {
			state.mode = 'edit';
		},
		setModeToReadable(state) {
			state.mode = 'read';
    },
    setPlayingStatus(state, { status }) {
			state.isPlaying = status;
			if (status) {
				state.isPainting = false;
			}
		},
		setPaintingStatus(state, { status }) {
			state.isPainting = status;
    },
    setToolsVisible(state, { toolsVisible }) {
			state.toolsVisible = toolsVisible;
		},
  },
  namespaced: true,
}