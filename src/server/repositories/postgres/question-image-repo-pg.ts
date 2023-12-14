import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { db } from '@/server/db';
import * as schema from '@/server/db/schema';

export class QuestionImageRepoPg {
	constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

	async addQuestionImage(...questionImage: schema.InsertQuestionImage[]) {
		await this.db.insert(schema.questionImages).values(questionImage);
	}
}

export const questionImageRepoPg = new QuestionImageRepoPg(db);