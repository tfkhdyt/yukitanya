import { eq } from 'drizzle-orm';

import { type Pg, db } from '@/server/db';
import { type InsertQuestionImage, questionImages } from '@/server/db/schema';

class QuestionImageRepoPg {
	constructor(private readonly db: Pg) {}

	async addQuestionImage(...questionImage: InsertQuestionImage[]) {
		await this.db.insert(questionImages).values(questionImage);
	}

	async findImagesByQuestionId(questionId: string) {
		return await this.db.query.questionImages.findMany({
			where: eq(questionImages.questionId, questionId),
		});
	}

	async deleteImagesByQuestionId(questionId: string) {
		return await this.db
			.delete(questionImages)
			.where(eq(questionImages.questionId, questionId))
			.returning({ id: questionImages.id });
	}
}

export { QuestionImageRepoPg };

export const questionImageRepoPg = new QuestionImageRepoPg(db);
