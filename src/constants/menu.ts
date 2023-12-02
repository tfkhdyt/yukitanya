import { Bell, Book, HomeIcon, Search } from 'lucide-react';

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
		icon: Book,
		title: 'Mata Pelajaran',
		url: '/subjects',
	},
	{
		icon: Bell,
		title: 'Notifikasi',
		url: '/notifications',
	},
	// {
	//   icon: Heart,
	//   title: 'Favorit',
	//   url: '/favorite',
	// },
];
