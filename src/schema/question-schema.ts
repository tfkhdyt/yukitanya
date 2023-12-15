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

export const findAllQuestionsSchema = z.object({
	limit: z.number().min(1).max(50).default(10),
	cursor: z.string().nullish(),
});

export const findAllQuestionsBySubjectSchema = z.object({
	subjectId: z.string(),
	limit: z.number().min(1).max(50).default(10),
	cursor: z.string().nullish(),
});

export const findAllQuestionsByUserIdSchema = z.object({
	userId: z.string(),
	limit: z.number().min(1).max(50).default(10),
	cursor: z.string().nullish(),
});

export const searchQuestionSchema = z.object({
	query: z.string(),
	subjectId: z.string(),
	limit: z.number().min(1).max(50).default(10),
	cursor: z.string().nullish(),
});

export type SearchQuestion = z.infer<typeof searchQuestionSchema>;