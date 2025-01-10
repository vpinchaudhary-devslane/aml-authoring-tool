import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { contentService } from '@/services/api-services/ContentService';
import { PaginationLimit } from '@/enums/tableEnums';
import {
  ContentActionPayloadType,
  getContentByIdCompletedAction,
  getContentByIdErrorAction,
  getListContentCompletedAction,
  getListContentErrorAction,
} from '../actions/content.actions';
import { ContentActionType } from '../actions/actions.constants';
import { AppState } from '../reducers';

interface ContentSagaPayloadType extends SagaPayloadType {
  payload: ContentActionPayloadType;
}

function* getListContentSaga(data: ContentSagaPayloadType): any {
  try {
    const { page_no: pageNo = 1, ...filters } = data.payload.filters;
    const cachedData: AppState['content']['cachedData'][string] = yield select(
      (state: AppState) =>
        state.content.cachedData[JSON.stringify(data.payload.filters)]
    );

    if (cachedData?.result) {
      const entities: AppState['content']['entities'] = yield select(
        (state: AppState) => state.content.entities
      );
      yield put(
        getListContentCompletedAction({
          contents: cachedData.result.map((id) => entities[id]).filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof contentService.getList>> =
      yield call(contentService.getList, {
        ...filters,
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });
    yield put(
      getListContentCompletedAction({
        contents: response.result.contents,
        totalCount: response.result.meta.total,
      })
    );
  } catch (e: any) {
    yield put(
      getListContentErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

function* getContentByIdSaga(data: any): any {
  try {
    const { id } = data.payload;

    const response: Awaited<ReturnType<typeof contentService.getById>> =
      yield call(contentService.getById, id);
    yield put(getContentByIdCompletedAction(response));
  } catch (e: any) {
    yield put(
      getContentByIdErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

// function* createContentSaga(data: any): any {
//   try {
//     const { content } = data.payload;

//     const response: Awaited<ReturnType<typeof contentService.create>> =
//       yield call(contentService.create, content);
//     yield put(createContentCompletedAction(response));
//   } catch (e: any) {
//     yield put(
//       createContentErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
//     );
//   }
// }

export function* contentSaga() {
  yield all([
    takeLatest(ContentActionType.GET_LIST, getListContentSaga),
    takeLatest(ContentActionType.GET_BY_ID, getContentByIdSaga),
    // takeLatest(ContentActionType.CREATE, createContentSaga),
  ]);
}
