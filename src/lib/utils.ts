import { botttsNeutral } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDiceBearAvatar(seed: string) {
  const avatar = createAvatar(botttsNeutral, {
    seed,
  });

  return avatar.toDataUriSync();
}

export function createInitial(name?: string | null) {
  return (
    name
      ?.split(' ')
      .map((name) => name.slice(0, 1))
      .join('') ?? ''
  );
}
