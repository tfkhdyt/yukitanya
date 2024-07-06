import { typesenseClient } from '@/lib/typesense';

export class QuestionRepoTypesense {
  static async searchQuestion(query: string, subjectId?: string) {
    const searchResult = await typesenseClient
      .collections('questions')
      .documents()
      .search({
        q: query,
        query_by: 'content',
        filter_by: subjectId === 'all' ? undefined : `subjectId:${subjectId}`,
      });

    //const hitsIds = searchResults.hits.map((hit) => hit.objectID);
    const hits = searchResult.hits?.map((hit) => ({
      // @ts-expect-error
      id: hit.document.id as string,
      // @ts-expect-error
      snippet: hit.highlights[0].snippet as string,
    }));

    if (!hits || (hits && hits.length === 0)) {
      throw new Error('Pertanyaan yang kamu cari tidak ditemukan');
    }

    return hits;
  }
}
