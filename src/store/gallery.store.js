export default {
  state: {
    paintingSelected: null,
		theme: 'light',
		filterCriterion: 'alphabet',
		filterDirection: 'asc',
  },
  mutations: {
    setPaintingSelected(state, payload) {
			state.paintingSelected = payload.paintingSelected;
		},
		changeTheme(state, payload) {
			state.theme = payload.theme;
		},
		setFilterCriterion(state, payload) {
			state.filterCriterion = payload.filterCriterion;
		},
  },
  namespaced: true,
};
