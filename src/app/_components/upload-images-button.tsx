// Note: `useUploadThing` is IMPORTED FROM YOUR CODEBASE using the `generateReactHelpers` function
import { useUploadThing } from '@/lib/uploadthing';
import { useState } from 'react';

import { Input } from './ui/input';
import { Label } from './ui/label';

export function useUploadImage() {
	const [files, setFiles] = useState<File[]>([]);

	const { startUpload } = useUploadThing('questionImageUploader', {
		onClientUploadComplete: () => {
			alert('uploaded successfully!');
		},
		onUploadError: () => {
			alert('error occurred while uploading');
		},
		onUploadBegin: () => {
			alert('upload has begun');
		},
	});

	// const { getRootProps, getInputProps } = useDropzone({
	// 	onDrop,
	// 	accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
	// });

	return {
		files,
		startUpload,
		UploadImagesButton: (
			<div className='grid w-full max-w-sm items-center gap-1.5'>
				<Label htmlFor='picture'>Gambar</Label>
				<Input
					accept='image/*'
					id='picture'
					type='file'
					onChange={(e) => {
						const files = e.target.files;
						if (!files) return;

						setFiles([...files]);
					}}
				/>
			</div>
		),
	};
}
