import { z } from 'zod';

import { insertQuestionSchema } from '@/server/db/schema';

export const createQuestionSchema = z.object({
	schema: insertQuestionSchema,
	token: z.string().optional(),
	image: z
		.object({
			id: z.string(),
			url: z.string().url(),
		})
		.array()
		.optional(),
});

export type CreateQuestion = z.infer<typeof createQuestionSchema>;