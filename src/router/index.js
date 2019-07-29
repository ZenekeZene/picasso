import Vue from 'vue';
import Router from 'vue-router';
import PaintPage from '../components/PaintPage';
import CRUDPage from '../components/CRUDPage';
import GalleryPage from '../components/GalleryPage';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'paint',
			component: PaintPage,
		},
		{
			path: '/paint/:id',
			name: 'paint',
			component: PaintPage,
		},
		{
			path: '/crud',
			name: 'crud',
			component: CRUDPage,
		},
		{
			path: '/gallery',
			name: 'gallery',
			component: GalleryPage,
		},
	],
});
