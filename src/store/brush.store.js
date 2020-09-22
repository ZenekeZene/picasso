export default {
  state: {
    colorErase: '',
    colorStroke: '#008f7a',
		strokeWidth: 10,
  },
  mutations: {
    setColorStroke(state, payload) {
      state.colorStroke = payload.colorStroke;
    },
    setColorErase(state, payload) {
      console.log(state)
      state.colorErase = payload.colorErase;
    },
    setStrokeWidth(state, payload) {
			state.strokeWidth = payload.strokeWidth;
		},
  },
  namespaced: true,
};