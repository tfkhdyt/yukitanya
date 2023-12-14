import { eq } from 'drizzle-orm';

import { Pg, db } from '@/server/db';
import * as schema from '@/server/db/schema';

class QuestionImageRepoPg {
	constructor(private readonly db: Pg) {}

	async addQuestionImage(...questionImage: schema.InsertQuestionImage[]) {
		await this.db.insert(schema.questionImages).values(questionImage);
	}

	async findImagesByQuestionId(questionId: string) {
		return await this.db.query.questionImages.findMany({
			where: eq(schema.questionImages.questionId, questionId),
		});
	}
}

export { QuestionImageRepoPg };

export const questionImageRepoPg = new QuestionImageRepoPg(db);
