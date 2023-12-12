import { Metadata } from 'next';

import { getServerAuthSession } from '@/server/auth';

import { formatLongDateTime } from '@/lib/datetime';
import { redirect } from 'next/navigation';
import { PremiumType } from './premium-type';

export const metadata: Metadata = {
	title: 'Premium - Yukitanya',
};

export default async function PremiumPage() {
	const session = await getServerAuthSession();
	if (!session) {
		return redirect('/home');
	}

	return (
		<div className='p-4'>
			{!session.user.membership ? (
				<>
					<h2 className='text-center text-2xl my-4 font-bold text-[#F48C06] uppercase'>
						Pilih paket yang cocok untuk Anda
					</h2>
					<PremiumType user={session.user} />
				</>
			) : (
				<>
					<h2 className='text-center text-2xl my-4 font-bold text-[#F48C06] uppercase'>
						Terima kasih telah berlangganan
					</h2>
					{session.user.membership.expiresAt && (
						<p className='text-center text-sm font-medium text-[#696984]'>
							Membership{' '}
							{session.user.membership.type === 'standard'
								? 'Premium'
								: 'Premium+'}{' '}
							mu akan berlaku sampai{' '}
							{formatLongDateTime(session.user.membership?.expiresAt)}
						</p>
					)}
				</>
			)}
		</div>
	);
}
