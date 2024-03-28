import { environment } from '@/environment.mjs';

const verifyEndpoint =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyCaptchaToken(token?: string) {
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
