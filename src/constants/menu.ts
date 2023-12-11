import {
	BellIcon,
	BookIcon,
	HeartIcon,
	HomeIcon,
	MessageSquarePlusIcon,
	SearchIcon,
	SparklesIcon,
} from 'lucide-react';

export const menu = [
	{
		icon: HomeIcon,
		title: 'Beranda',
		url: '/home',
	},
	{
		icon: SearchIcon,
		title: 'Cari',
		url: '/search',
	},
	{
		icon: MessageSquarePlusIcon,
		title: 'Buat',
		url: '',
	},
	{
		icon: BellIcon,
		title: 'Notifikasi',
		url: '/notifications',
	},
	{
		icon: BookIcon,
		title: 'Mata Pelajaran',
		url: '/subjects',
	},
	{
		icon: SparklesIcon,
		title: 'Premium',
		url: '/premium',
	},
	{
		icon: HeartIcon,
		title: 'Favorit',
		url: '/favorite',
	},
];
