import { QuestionSet } from '@/models/entities/QuestionSet';
import { QuestionSetCreateUpdatePayload } from '@/components/QuestionSet/QuestionSetListing/QuestionSetDetails/QuestionSetDetails';
import { Board } from '@/models/entities/Board';
import { baseApiService } from './BaseApiService';

class QuestionSetService {
  static getInstance(): QuestionSetService {
    return new QuestionSetService();
  }

  async getList(data: {
    filters: {
      search_query?: string;
      status?: string;
      repository_id?: string;
      board_id?: string;
      class_id?: string;
      l1_skill_id?: string;
      l2_skill_id?: string;
      l3_skill_id?: string;
      sub_skill_id?: string;
    };
    limit?: number;
    offset?: number;
  }): Promise<{
    result: {
      boards: Board[];
      question_sets: QuestionSet[];
      meta: {
        offset: number;
        limit: number;
        total: number;
      };
    };
  }> {
    return baseApiService.post(
      '/api/v1/question-set/search',
      'api.questionSet.search',
      data
    );
  }

  async delete(id: string) {
    return baseApiService.post(
      `/api/v1/question-set/delete/${id}`,
      'api.questionSet.delete',
      { id }
    );
  }

  async getById(id: string) {
    return baseApiService.get(`/api/v1/question-set/read/${id}`);
  }

  async create(questionSet: QuestionSetCreateUpdatePayload) {
    return baseApiService.post(
      `/api/v1/question-set/create`,
      'api.questionSet.create',
      questionSet
    );
  }

  async update({
    questionSetId,
    data,
  }: {
    questionSetId: string;
    data: Partial<QuestionSetCreateUpdatePayload>;
  }) {
    return baseApiService.post(
      `/api/v1/question-set/update/${questionSetId}`,
      'api.questionSet.update',
      data
    );
  }
}

export const questionSetService = QuestionSetService.getInstance();
