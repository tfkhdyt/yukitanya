import { PertanyaanKosong } from '@/components/pertanyaan-kosong';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';

import { SkeletonUserEntry } from './skeleton-user-entry';
import { UserEntry } from './user-entry';

export function UserList({ query }: { query: string }) {
	const users = api.user.findUsersByUsernameOrName.useQuery(query);

	if (users.isLoading || !users.data) {
		return <SkeletonUserEntry />;
	}

	if (users.isError) {
		return (
			<PertanyaanKosong
				title={users.error?.message}
				showTanyakanButton={false}
			/>
		);
	}

	if (users.data.length === 0) {
		return (
			<PertanyaanKosong
				title='Pengguna yang kamu cari tidak ditemukan'
				showTanyakanButton={false}
			/>
		);
	}

	return (
		<>
			{users.data.map((user) => {
				return (
					<UserEntry
						user={{
							...user,
							initial: createInitial(user.name),
						}}
						key={user.id}
					/>
				);
			})}
		</>
	);
}
