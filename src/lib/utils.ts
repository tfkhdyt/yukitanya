import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDiceBearUrl(seed: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`;
}
