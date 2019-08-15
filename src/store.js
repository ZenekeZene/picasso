import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	plugins: [
		createPersistedState({
			key: 'picasso-state',
		}),
	],
	state: {
		history: [[]],
		indexLine: 0,
		mode: 'edit',
		canvas: null,
		ctx: null,
		isPlaying: false,
		isPainting: false,
		colorStroke: '#008f7a',
		colorErase: '',
		strokeWidth: 10,
		paintingSelected: null,
	},
	getters: {
		isDisabled: state => (state.isPlaying || state.isPainting || state.history.length === 0),
		isPauseDisabled: state => state.isPainting || state.history.length === 0,
	},
	mutations: {
		setColorStroke(state, payload) {
			state.colorStroke = payload.colorStroke;
		},
		setColorErase(state, payload) {
			state.colorErase = payload.colorErase;
		},
		setHistory(state, payload) {
			state.history = payload.history;
		},
		createNewStrokeOnHistory(state) {
			state.history[state.indexLine] = [];
		},
		removeStrokeOnHistory(state) {
			state.history.pop();
		},
		pushDotOnHistory(state, payload) {
			state.history[state.indexLine].push(payload.dot);
		},
		deleteAllHistory(state) {
			state.history = [];
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
		setModeToEditable(state) {
			state.mode = 'edit';
		},
		setModeToReadable(state) {
			state.mode = 'read';
		},
		setCanvas(state, payload) {
			state.canvas = payload.canvas;
			state.ctx = state.canvas.getContext('2d');
		},
		setBackgroundCanvas(state) {
			state.ctx.fillStyle = state.colorErase;
			state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
		},
		setPlayingStatus(state, payload) {
			state.isPlaying = payload.status;
		},
		setPaintingStatus(state, payload) {
			state.isPainting = payload.status;
		},
		setStrokeWidth(state, payload) {
			state.strokeWidth = payload.strokeWidth;
		},
		clearCanvas(state) {
			state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
			state.ctx.fillStyle = state.colorErase;
			state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
		},
		setPaintingSelected(state, payload) {
			state.paintingSelected = payload.paintingSelected;
		},
	},
	actions: {
		getHistoryOfPainting({ commit }, payload) {
			return new Promise((resolve, reject) => {
				window.db
					.collection('painting')
					.doc(payload.paintingId)
					.get()
					.then((snapshot) => {
						commit('setHistoryOfPainting', {
							raw: snapshot.data().history,
						});
						resolve();
					})
					.catch((error) => {
						console.error(error);
						reject();
					});
			});
		},
	},
});

export default store;
