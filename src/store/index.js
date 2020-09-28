import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import brush from './brush.store';
import strokes from './history.store';
import gallery from './gallery.store';
import status from './status.store';

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
				'canvas',
				'ctx',
				'gallery.paintingSelected',
				'status.mode',
			]
		}),
	],
	modules: {
		status,
		strokes,
		brush,
		gallery,
	},
	state: {
		canvas: null,
		ctx: null,
	},
	mutations: {
		setCanvas(state, payload) {
			state.canvas = payload.canvasRef;
			state.ctx = payload.canvasRef.getContext('2d');
			state.ctx.lineJoin = 'round';
			state.ctx.lineCap = 'round';
		},
		setBackgroundCanvas(state) {
			state.ctx.fillStyle = state.brush.colorErase;
			state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
		},
		clearCanvas(state) {
			state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
			state.ctx.fillStyle = state.brush.colorErase;
			state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
		},
	},
});

export default store;
