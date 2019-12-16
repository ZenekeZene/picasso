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
		brushIndex: 0,
		colorErase: '',
		strokeWidth: 10,
		paintingSelected: null,
		theme: 'light',
		filterCriterion: 'alphabet',
		filterDirection: 'asc',
	},
	getters: {
		isDisabled: (state) => state.isPlaying || state.isPainting || state.history.length === 0,
		isPauseDisabled: (state) => state.isPainting || state.history.length === 0,
	},
	mutations: {
		setCanvas(state, payload) {
			state.canvas = payload.canvasRef;
			state.ctx = payload.canvasRef.getContext('2d');
			state.ctx.lineJoin = 'round';
			state.ctx.lineCap = 'round';
		},
		setColorStroke(state, payload) {
			state.colorStroke = payload.colorStroke;
		},
		setColorErase(state, payload) {
			state.colorErase = payload.colorErase;
		},
		setHistory(state, payload) {
			state.history = payload.history;
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
				payload.dot.brushIndex = state.brushIndex;
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
		setModeToEditable(state) {
			state.mode = 'edit';
		},
		setModeToReadable(state) {
			state.mode = 'read';
		},
		setBackgroundCanvas(state) {
			state.ctx.fillStyle = state.colorErase;
			state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
		},
		setPlayingStatus(state, payload) {
			state.isPlaying = payload.status;
			if (payload.status) {
				state.isPainting = false;
			}
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
		changeTheme(state, payload) {
			state.theme = payload.theme;
		},
		setFilterCriterion(state, payload) {
			state.filterCriterion = payload.filterCriterion;
		},
		changeBrush(state, payload) {
			if (payload) {
				state.brushIndex = payload.brushIndex;
			} else {
				state.brushIndex = 0;
			}
		},
	},
	actions: {
		getHistoryOfPainting(...params) {
			const [, payload] = params;
			return new Promise((resolve, reject) => {
				window.db
					.collection('painting')
					.doc(payload.paintingId)
					.get()
					.then((snapshot) => {
						resolve(snapshot.data());
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
	},
});

export default store;
