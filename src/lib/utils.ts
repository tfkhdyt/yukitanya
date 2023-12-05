import { environment } from '@/environment.mjs';
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

export async function verifyCaptchaToken(token?: string) {
	const verifyEndpoint =
		'https://challenges.cloudflare.com/turnstile/v0/siteverify';

	const res = await fetch(verifyEndpoint, {
		method: 'POST',
		body: `secret=${encodeURIComponent(
			environment.TURNSTILE_SECRET_KEY,
		)}&response=${encodeURIComponent(token ?? '')}`,
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
		},
	});

	const data = await res.json();

	if (!data.success || !res.ok) {
		throw new Error('Token captcha Anda tidak valid');
	}
}
