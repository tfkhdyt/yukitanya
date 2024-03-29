import { generateReactHelpers } from '@uploadthing/react/hooks';

import type { MyFileRouter } from '@/app/api/uploadthing/core';

// Export const { UploadButton, UploadDropzone, Uploader } =
//   generateComponents<MyFileRouter>();

export const { useUploadThing } = generateReactHelpers<MyFileRouter>();
