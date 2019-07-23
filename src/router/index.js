import Vue from 'vue';
import Router from 'vue-router';
import PaintPage from '../components/PaintPage';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'paint',
			component: PaintPage,
		},
	],
});
