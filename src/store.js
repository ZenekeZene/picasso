import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	/*plugins: [
		createPersistedState({
			key: 'picasso-state',
		}),
	],*/
	state: {
		historyPersisted: [[]],
		indexLine: 0,
		mode: 'edit',
		canvas: null,
		ctx: null,
		isPlaying: false,
		isPainting: false,
	},
	getters: {
		isDisabled: (state) => {
			return (
				state.isPlaying ||
				state.isPainting ||
				state.historyPersisted.length === 0
			);
		},
		isPauseDisabled: (state) => {
			return state.isPainting || state.historyPersisted.length === 0;
		},
	},
	mutations: {
		setHistoryPersisted(state, payload) {
			state.historyPersisted = payload.historyPersisted;
		},
		createNewStrokeOnHistory(state) {
			state.historyPersisted[state.indexLine] = [];
		},
		removeStrokeOnHistory(state) {
			state.historyPersisted.pop();
		},
		pushDotOnHistory(state, payload) {
			state.historyPersisted[state.indexLine].push(payload.dot);
		},
		deleteAllHistory(state) {
			state.historyPersisted = [];
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
			state.historyPersisted = JSON.parse(payload.raw);
		},
		setModeToEditable(state) {
			state.mode = 'edit';
		},
		setModeToReadable(state) {
			state.mode = 'read';
		},
		setCanvas(state, payload) {
			state.canvas = payload.canvas;
		},
		setContextCanvas(state, payload) {
			state.ctx = payload.canvas.getContext('2d');
		},
		setPlayingStatus(state, payload) {
			state.isPlaying = payload.status;
		},
		setPaintingStatus(state, payload) {
			state.isPainting = payload.status;
		},
	},
});

export default store;
