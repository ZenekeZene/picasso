import Vue from 'vue';
import Router from 'vue-router';
import PaintPage from '@/ui/modules/painting/PaintPage';
import CRUDPage from '@/ui/modules/user/CRUDPage';
import GalleryPage from '@/ui/modules/gallery/GalleryPage';
import SettingsPage from '@/ui/modules/settings/SettingsPage';

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
