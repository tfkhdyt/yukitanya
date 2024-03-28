import { generateComponents } from '@uploadthing/react';
import { generateReactHelpers } from '@uploadthing/react/hooks';

import type { MyFileRouter } from '@/app/api/uploadthing/core';

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<MyFileRouter>();

export const { useUploadThing } = generateReactHelpers<MyFileRouter>();
