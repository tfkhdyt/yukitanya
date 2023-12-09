import { MyFileRouter } from '@/app/api/uploadthing/core';
import { generateComponents } from '@uploadthing/react';
import { generateReactHelpers } from '@uploadthing/react/hooks';

export const { UploadButton, UploadDropzone, Uploader } =
	generateComponents<MyFileRouter>();

export const { useUploadThing } = generateReactHelpers<MyFileRouter>();
