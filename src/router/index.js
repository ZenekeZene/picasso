import Vue from 'vue';
import Router from 'vue-router';
import PaintPage from '../components/pages/PaintPage';
import CRUDPage from '../components/pages/CRUDPage';
import GalleryPage from '../components/pages/GalleryPage';
import SettingsPage from '../components/pages/SettingsPage';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'paint',
			component: PaintPage,
		},
		{
			path: '/paint/:paintId',
			name: 'paintById',
			component: PaintPage,
		},
		{
			path: '/crud',
			name: 'crud',
			component: CRUDPage,
			meta: {
				withBackArrow: true,
			}
		},
		{
			path: '/gallery',
			name: 'gallery',
			component: GalleryPage,
		},
		{
			path: '/settings',
			name: 'settings',
			component: SettingsPage,
		},
	],
});
