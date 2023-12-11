import {
	Bell,
	Book,
	HomeIcon,
	MessageSquarePlusIcon,
	Search,
	SparklesIcon,
} from 'lucide-react';

export const menu = [
	{
		icon: HomeIcon,
		title: 'Beranda',
		url: '/home',
	},
	{
		icon: Search,
		title: 'Cari',
		url: '/search',
	},
	{
		icon: MessageSquarePlusIcon,
		title: 'Buat',
		url: '',
	},
	{
		icon: Bell,
		title: 'Notifikasi',
		url: '/notifications',
	},
	{
		icon: Book,
		title: 'Mata Pelajaran',
		url: '/subjects',
	},
	{
		icon: SparklesIcon,
		title: 'Premium',
		url: '/premium',
	},
	// {
	//   icon: Heart,
	//   title: 'Favorit',
	//   url: '/favorite',
	// },
];
