import { baseApiService } from './BaseApiService';

class ContentService {
  static getInstance(): ContentService {
    return new ContentService();
  }

  async getList(data: {
    search_query?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    result: {
      contents: string[];
      meta: {
        offset: number;
        limit: number;
        total: number;
      };
    };
  }> {
    return baseApiService.post(
      '/api/v1/content/search',
      'api.content.search',
      data
    );
  }

  async getById(id: string) {
    return baseApiService.get(`/api/v1/content/read/${id}`);
  }
}

export const contentService = ContentService.getInstance();
