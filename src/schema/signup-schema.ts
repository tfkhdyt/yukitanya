import { z } from 'zod';

export const signupSchema = z
	.object({
		confirmPassword: z
			.string({ required_error: 'Confirm password tidak boleh kosong' })
			.min(8, 'Confirm password harus lebih dari 8 karakter'),
		email: z
			.string({ required_error: 'Email tidak boleh kosong' })
			.email('Email tidak valid')
			.trim(),
		firstName: z
			.string({ required_error: 'Nama depan tidak boleh kosong' })
			.min(1, 'Nama depan tidak boleh kosong')
			.max(100, 'Nama depan tidak boleh lebih dari 100 karakter')
			.trim(),
		lastName: z
			.string()
			.max(100, 'Nama belakang tidak boleh lebih dari 100 karakter')
			.trim()
			.optional(),
		password: z
			.string({ required_error: 'Password tidak boleh kosong' })
			.min(8, 'Password harus lebih dari 8 karakter'),
		username: z
			.string({ required_error: 'Username tidak boleh kosong' })
			.min(4, 'Username tidak boleh kurang dari 4 karakter')
			.max(25, 'Username tidak boleh lebih dari 25 karakter')
			.trim()
			.regex(/^[a-zA-Z0-9_-]+$/, {
				message: 'Username tidak boleh mengandung karakter spesial',
			}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Password tidak cocok',
		path: ['confirmPassword'],
	});

export type SignupSchema = z.infer<typeof signupSchema>;
