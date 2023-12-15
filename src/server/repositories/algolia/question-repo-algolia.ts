import { SearchIndex } from 'algoliasearch';

import { questionIndex } from '@/lib/algolia';

class QuestionRepoAlgolia {
	constructor(private readonly questionIndex: SearchIndex) {}

	async searchQuestion(query: string, subjectId?: string) {
		const searchResults = await this.questionIndex.search(query, {
			filters: subjectId !== 'all' ? `subjectId:${subjectId}` : undefined,
		});
		const hitsIds = searchResults.hits.map((hit) => hit.objectID);

		if (hitsIds.length === 0) {
			throw new Error('Pertanyaan yang kamu cari tidak ditemukan');
		}

		return hitsIds;
	}
}

export { QuestionRepoAlgolia };

export const questionRepoAlgolia = new QuestionRepoAlgolia(questionIndex);