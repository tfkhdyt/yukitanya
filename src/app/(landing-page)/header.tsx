'use client';

import { useWindowScroll } from '@uidotdev/usehooks';
import clsx from 'clsx';
import { AlignJustify } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollIntoView from 'react-scroll-into-view';

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet';

type Navbar = {
	id: string;
	title: string;
};

export function Header() {
	const navbar: Navbar[] = [
		{
			id: 'home',
			title: 'Home',
		},
		{
			id: 'tentang-kami',
			title: 'Tentang Kami',
		},
		{
			id: 'keunggulan',
			title: 'Keunggulan',
		},
		{
			id: 'fitur',
			title: 'Fitur',
		},
	];
	const [{ y }] = useWindowScroll();

	return (
		<header
			className={clsx(
				'fixed inset-x-0 top-0 z-10 transition-all',
				y && y > 30 && 'border-b-2 bg-white/75 backdrop-blur-md',
			)}
		>
			<div className='container flex items-center justify-between py-6 md:px-12'>
				<div className='flex items-center space-x-3'>
					<Image
						alt='Yukitanya Logo'
						className='-mt-4'
						height={57}
						src='/img/yukitanya_logo.png'
						width={60}
					/>
					<p className='font-rubik text-2xl font-extrabold'>Yukitanya</p>
				</div>
				<Sheet>
					<SheetTrigger aria-label='Mobile nav' className='p-2 lg:hidden'>
						<AlignJustify />
					</SheetTrigger>
					<SheetContent className='flex w-fit flex-col space-y-4 pt-12 max-w-[250px]'>
						{navbar.map((each) => (
							<SheetClose asChild key={each.id}>
								<ScrollIntoView
									className='cursor-pointer text-[#696984]'
									selector={`#${each.id}`}
								>
									{each.title}
								</ScrollIntoView>
							</SheetClose>
						))}
						<div className='gap-3 flex flex-wrap'>
							<Link
								className='rounded-lg bg-[#F48C06] px-4 py-2 font-semibold text-white shadow-md'
								href='/auth/sign-in'
							>
								Masuk
							</Link>
							<Link
								className='rounded-lg bg-[#77425A] px-4 py-2 font-semibold text-white shadow-md'
								href='/auth/sign-up'
							>
								Daftar
							</Link>
							<Link href='/apk/Yukitanya-v0.0.1.apk' className='p-0' download>
								<Image
									src='/img/pwa-button.png'
									alt='PWA'
									height={28}
									width={135}
									className='h-full rounded-lg'
								/>
							</Link>
						</div>
					</SheetContent>
				</Sheet>

				<nav className='hidden items-center space-x-12 lg:flex'>
					{navbar.map((each) => (
						<ScrollIntoView
							className='cursor-pointer text-[#696984]'
							key={each.id}
							selector={`#${each.id}`}
						>
							{each.title}
						</ScrollIntoView>
					))}
					<div className='space-x-3 flex'>
						<Link
							className='rounded-lg bg-[#F48C06] px-4 py-2 font-semibold text-white shadow-md'
							href='/auth/sign-in'
						>
							Masuk
						</Link>
						<Link
							className='rounded-lg bg-[#77425A] px-4 py-2 font-semibold text-white shadow-md'
							href='/auth/sign-up'
						>
							Daftar
						</Link>
						<Link href='/apk/Yukitanya-v0.0.1.apk' className='p-0' download>
							<Image
								src='/img/pwa-button.png'
								alt='PWA'
								height={28}
								width={135}
								className='h-full rounded-lg'
							/>
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
}
