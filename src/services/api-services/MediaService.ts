import { baseApiService } from './BaseApiService';

class MediaService {
  static getInstance(): MediaService {
    return new MediaService();
  }

  async getPresignedUrls(
    data: {
      fileName: string;
      category: string;
    }[]
  ) {
    return baseApiService.post(
      '/api/v1/media/upload/presigned-url',
      'api.media.upload',
      data
    );
  }
}

export const mediaService = MediaService.getInstance();
