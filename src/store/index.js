import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import brush from './brush.store';
import strokes from './history.store';
import gallery from './gallery.store';

Vue.use(Vuex);

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	plugins: [
		createPersistedState({
			key: 'picasso-state',
			paths: [
				'brush.colorErase',
				'brush.colorStroke',
				'brush.strokeWidth',
				'strokes.history',
			]
		}),
	],
	modules: {
		strokes,
		brush,
		gallery,
	},
	state: {
		mode: 'edit',
		canvas: null,
		ctx: null,
		isPlaying: false,
		isPainting: false,
		toolsVisible: false,
	},
	getters: {
		isDisabled: (state) => state.isPlaying || state.isPainting || state.strokes.history.length === 0,
		isPauseDisabled: (state) => state.isPainting || state.strokes.history.length === 0,
	},
	mutations: {
		setCanvas(state, payload) {
			state.canvas = payload.canvasRef;
			state.ctx = payload.canvasRef.getContext('2d');
			state.ctx.lineJoin = 'round';
			state.ctx.lineCap = 'round';
		},
		setModeToEditable(state) {
			state.mode = 'edit';
		},
		setModeToReadable(state) {
			state.mode = 'read';
		},
		setBackgroundCanvas(state) {
			state.ctx.fillStyle = state.brush.colorErase;
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
		clearCanvas(state) {
			state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
			state.ctx.fillStyle = state.brush.colorErase;
			state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
		},
		setToolsVisible(state, payload) {
			state.toolsVisible = payload.toolsVisible;
		},
	},
});

export default store;
