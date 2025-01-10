import { mediaService } from '@/services/api-services/MediaService';
import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { uploadService } from '@/services/api-services/UploadService';
import { toastService } from '@/services/ToastService';
import {
  getPresignedUrlCompletedAction,
  getPresignedUrlErrorAction,
  uploadCompletedAction,
  uploadErrorAction,
} from '../actions/media.actions';
import { MediaActionType } from '../actions/actions.constants';

interface MediaSagaPayloadType extends SagaPayloadType {
  payload: {
    fileName: string;
    category: string;
  }[];
}

function* getPresignedUrlSaga(data: MediaSagaPayloadType): any {
  try {
    const response = yield call(mediaService.getPresignedUrls, data.payload);
    yield put(getPresignedUrlCompletedAction(response.result));
  } catch (e: any) {
    yield put(
      getPresignedUrlErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

function* uploadSingleMediaSaga(data: any): any {
  try {
    const uploadResponse = yield call(uploadService.uploadFile, data.payload);
    yield put(uploadCompletedAction(uploadResponse));
  } catch (e: any) {
    yield put(
      uploadErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
  }
}

function* uploadContentSaga(data: any): any {
  const uploadData = data.payload;
  try {
    for (let i = 0; i < uploadData.length; i += 1) {
      const { file, signedUrl } = uploadData[i];

      yield call(uploadSingleMediaSaga, {
        payload: { file, signedUrl },
      });
    }
  } catch (e: any) {
    yield put(
      uploadErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
    toastService.showError('Unable to upload files, please try again');
  }
}

export function* mediaSaga() {
  yield all([
    takeLatest(MediaActionType.GET_PRESIGNED_URL, getPresignedUrlSaga),
    takeLatest(MediaActionType.UPLOAD, uploadContentSaga),
  ]);
}
