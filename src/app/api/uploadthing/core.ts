import { getServerAuthSession } from '@/server/auth';
import { FileRouter, createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

export const fileRouter = {
	questionImageUploader: f({
		image: { maxFileSize: '512KB', maxFileCount: 4 },
	})
		.middleware(async () => {
			const session = await getServerAuthSession();
			if (!session) {
				throw new Error('Unauthorized');
			}

			return { id: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.info('Upload complete for userId:', metadata.id);
			console.info('File url:', file.url);

			return {
				message: 'success',
			};
		}),
} satisfies FileRouter;

export type MyFileRouter = typeof fileRouter;
