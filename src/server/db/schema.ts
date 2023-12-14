import { relations } from 'drizzle-orm';
import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { type AdapterAccount } from 'next-auth/adapters';
import { z } from 'zod';

export const users = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	username: varchar('username', { length: 25 }).notNull().unique(),
	email: text('email').notNull().unique(),
	emailVerified: timestamp('emailVerified', {
		mode: 'date',
		withTimezone: true,
	}),
	image: text('image'),
	password: text('password').notNull(),
	createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	answers: many(answers),
	favorites: many(favorites),
	questions: many(questions),
	ratings: many(ratings),
	notifications: many(notifications),
	memberships: many(memberships),
}));

export const accounts = pgTable(
	'account',
	{
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		id_token: text('id_token'),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		scope: text('scope'),
		session_state: text('session_state'),
		token_type: text('token_type'),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
	},
	(account) => ({
		compoundKey: primaryKey(account.provider, account.providerAccountId),
	}),
);

export const sessions = pgTable('session', {
	expires: timestamp('expires', { mode: 'date', withTimezone: true }).notNull(),
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
});

export const verificationTokens = pgTable(
	'verificationToken',
	{
		expires: timestamp('expires', {
			mode: 'date',
			withTimezone: true,
		}).notNull(),
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey(vt.identifier, vt.token),
	}),
);

export const questions = pgTable('question', {
	content: text('content').notNull(),
	createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
		.defaultNow()
		.notNull(),
	id: text('id').notNull().primaryKey(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	subjectId: text('subject_id')
		.notNull()
		.references(() => subjects.id, { onDelete: 'cascade' }),
	updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
		.defaultNow()
		.notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
});

export type InsertQuestion = typeof questions.$inferInsert;
export type SelectQuestion = typeof questions.$inferSelect;

export const insertQuestionSchema = createInsertSchema(questions, {
	content: (schema) => schema.content.min(1).max(1000),
});

export const questionsRelations = relations(questions, ({ many, one }) => ({
	answers: many(answers),
	favorites: many(favorites),
	owner: one(users, {
		fields: [questions.userId],
		references: [users.id],
	}),
	subject: one(subjects, {
		fields: [questions.subjectId],
		references: [subjects.id],
	}),
	oldSlugs: many(oldSlug),
	notifications: many(notifications),
	images: many(questionImages),
}));

export const oldSlug = pgTable('old_slug', {
	id: text('id').notNull().primaryKey(),
	questionId: text('question_id')
		.notNull()
		.references(() => questions.id, { onDelete: 'cascade' }),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
});

export const oldSlugsRelations = relations(oldSlug, ({ one }) => ({
	question: one(questions, {
		fields: [oldSlug.questionId],
		references: [questions.id],
	}),
}));

export const answers = pgTable('answer', {
	content: text('content').notNull(),
	createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
		.defaultNow()
		.notNull(),
	id: text('id').notNull().primaryKey(),
	isBestAnswer: boolean('is_best_answer').notNull().default(false),
	questionId: text('question_id')
		.notNull()
		.references(() => questions.id, { onDelete: 'cascade' }),
	updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
		.defaultNow()
		.notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
});

export const insertAnswerSchema = createInsertSchema(answers, {
	content: (schema) => schema.content.min(1).max(1000),
});
export const updateAnswerSchema = z.object({
	id: z.string(),
	content: z.string().min(1).max(1000),
	token: z.string().optional(),
});

export const answersRelations = relations(answers, ({ many, one }) => ({
	owner: one(users, {
		fields: [answers.userId],
		references: [users.id],
	}),
	question: one(questions, {
		fields: [answers.questionId],
		references: [questions.id],
	}),
	ratings: many(ratings),
}));

export const subjects = pgTable('subject', {
	id: text('id').notNull().primaryKey(),
	name: varchar('name', { length: 50 }).notNull(),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
	questions: many(questions),
}));

export const favorites = pgTable(
	'favorite',
	{
		questionId: text('question_id')
			.notNull()
			.references(() => questions.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.questionId, t.userId] }),
	}),
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
	question: one(questions, {
		fields: [favorites.questionId],
		references: [questions.id],
	}),
	user: one(users, {
		fields: [favorites.userId],
		references: [users.id],
	}),
}));

export const ratings = pgTable('rating', {
	answerId: text('answer_id')
		.notNull()
		.references(() => answers.id, { onDelete: 'cascade' }),
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	value: integer('value').notNull(),
});

export const ratingsRelations = relations(ratings, ({ one }) => ({
	answer: one(answers, {
		fields: [ratings.answerId],
		references: [answers.id],
	}),
	owner: one(users, {
		fields: [ratings.userId],
		references: [users.id],
	}),
}));

export const notifications = pgTable('notification', {
	id: text('id').notNull().primaryKey(),
	type: text('type', {
		enum: ['rating', 'best-answer', 'new-answer', 'favorite'],
	}).notNull(),
	receiverUserId: text('receiver_user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	transmitterUserId: text('transmitter_user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	rating: integer('rating'),
	questionId: text('question_id')
		.notNull()
		.references(() => questions.id, { onDelete: 'cascade' }),
	description: varchar('description', { length: 100 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
		.defaultNow()
		.notNull(),
	readAt: timestamp('read_at', { mode: 'date', withTimezone: true }),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
	receiverUser: one(users, {
		fields: [notifications.receiverUserId],
		references: [users.id],
	}),
	transmitterUser: one(users, {
		fields: [notifications.transmitterUserId],
		references: [users.id],
	}),
	question: one(questions, {
		fields: [notifications.questionId],
		references: [questions.id],
	}),
}));

export const questionImages = pgTable('question_image', {
	id: text('id').notNull().primaryKey(),
	url: text('url').notNull(),
	questionId: text('question_id')
		.notNull()
		.references(() => questions.id, { onDelete: 'cascade' }),
});

export type InsertQuestionImage = typeof questionImages.$inferInsert;

export const questionImagesRelations = relations(
	questionImages,
	({ one }) => ({
		question: one(questions, {
			fields: [questionImages.questionId],
			references: [questions.id],
		}),
	}),
);

export const memberships = pgTable('membership', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	type: varchar('type', { enum: ['standard', 'plus'], length: 10 }).notNull(),
	expiresAt: timestamp('expires_at', {
		mode: 'date',
		withTimezone: true,
	}).notNull(),
});

export const membershipsRelations = relations(memberships, ({ one }) => ({
	owner: one(users, {
		fields: [memberships.userId],
		references: [users.id],
	}),
}));
