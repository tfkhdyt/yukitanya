import { Bell, Book, HomeIcon, PencilIcon, Search } from 'lucide-react';

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
		icon: PencilIcon,
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
	// {
	//   icon: Heart,
	//   title: 'Favorit',
	//   url: '/favorite',
	// },
];
