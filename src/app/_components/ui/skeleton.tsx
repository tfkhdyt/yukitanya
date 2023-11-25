import { type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...properties
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...properties}
    />
  );
}

export { Skeleton };
