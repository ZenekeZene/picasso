import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	plugins: [
		createPersistedState({
			key: 'palette-state',
		}),
	],
	state: {
		historyPersisted: [],
	},
	mutations: {
		setHistory(state, payload) {
			state.history = payload.history;
		},
	},
});

export default store;
