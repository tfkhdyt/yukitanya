import { api } from '@/trpc/react';

export function NotifCount({ userId }: { userId: string }) {
	const { data } = api.notification.getNotificationCount.useQuery(userId);

	if (data && data > 0)
		return (
			<div className='absolute top-0 left-7 md:left-1.5 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-[#F48C06] rounded-full'>
				{data}
			</div>
		);
}
