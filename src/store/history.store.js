export default {
  state: {
    history: [[]],
		indexLine: 0,
  },
  mutations: {
    setHistory(state, payload) {
			state.history = JSON.parse(payload.history);
		},
		deleteHistory(state) {
			state.history = null;
		},
		createNewStrokeOnHistory(state) {
			state.history[state.indexLine] = [];
		},
		removeStrokeOnHistory(state) {
			state.history.pop();
		},
		pushDotOnHistory(state, payload) {
			if (state.history[state.indexLine].length === 0) {
				payload.dot.brushIndex = payload.brushIndex;
			}
			state.history[state.indexLine].push(payload.dot);
		},
		deleteAllHistory(state) {
			state.history = [];
			state.indexLine = 0;
		},
		incrementIndexLine(state) {
			state.indexLine += 1;
		},
		decreaseIndexLine(state) {
			state.indexLine -= 1;
		},
		resetIndexLine(state) {
			state.indexLine = 0;
		},
		setHistoryOfPainting(state, payload) {
			state.history = JSON.parse(payload.raw);
		},
  },
  namespaced: true,
};