import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { db } from '@/server/db';
import * as schema from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export class QuestionImageRepoPg {
		constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

		async addQuestionImage(...questionImage: schema.InsertQuestionImage[]) {
			await this.db.insert(schema.questionImages).values(questionImage);
		}

		async findImagesByQuestionId(questionId: string) {
			return await this.db.query.questionImages.findMany({
				where: eq(schema.questionImages.questionId, questionId),
			});
		}
	}

export const questionImageRepoPg = new QuestionImageRepoPg(db);
