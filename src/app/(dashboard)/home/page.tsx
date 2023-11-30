import clsx from 'clsx';
import { type Metadata } from 'next';
import Image from 'next/image';

import { TanyakanSekarangButton } from '@/components/buttons/tanyakan-sekarang';
import { getServerAuthSession } from '@/server/auth';

import { Timeline } from './timeline';

export const metadata: Metadata = {
	title: 'Beranda - Yukitanya',
};

export default async function Home() {
	const session = await getServerAuthSession();

	return (
		<>
			<div
				className={clsx(
					'flex border-b-2 p-6 md:items-center lg:hidden',
					session?.user ?? 'hidden',
				)}
			>
				<div className='w-2/3 space-y-4 pr-2'>
					<h2 className='text-xl font-extrabold'>
						JANGAN MALU UNTUK BERTANYA!
					</h2>
					{session?.user && <TanyakanSekarangButton user={session?.user} />}
				</div>
				<div className='w-1/3'>
					<Image
						alt='Mari bertanya'
						className='mx-auto'
						height={129}
						src='/img/home/mari-bertanya.png'
						width={168}
					/>
				</div>
			</div>
			<Timeline session={session} />
		</>
	);
}
