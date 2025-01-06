import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { questionSetService } from '@/services/api-services/QuestionSetService';
import { PaginationLimit } from '@/enums/tableEnums';
import { toastService } from '@/services/ToastService';
import {
  deleteQuestionSetCompletedAction,
  getListQuestionSetAction,
  getListQuestionSetCompletedAction,
  getListQuestionSetErrorAction,
  QuestionSetActionPayloadType,
} from '../actions/questionSet.actions';
import { QuestionSetActionType } from '../actions/actions.constants';
import { AppState } from '../reducers';

interface QuestionSetSagaPayloadType extends SagaPayloadType {
  payload: QuestionSetActionPayloadType;
}

interface DeleteQuestionSetSagaPayloadType extends SagaPayloadType {
  payload: { questionSetId: string };
}

function* getListQuestionSetSaga(data: QuestionSetSagaPayloadType): any {
  try {
    const { page_no: pageNo = 1, ...filters } = data.payload.filters;
    const cachedData: AppState['questionSet']['cachedData'][string] =
      yield select(
        (state: AppState) =>
          state.questionSet.cachedData[JSON.stringify(data.payload.filters)]
      );

    if (cachedData?.result) {
      const entities: AppState['questionSet']['entities'] = yield select(
        (state: AppState) => state.questionSet.entities
      );

      yield put(
        getListQuestionSetCompletedAction({
          questionSets: cachedData.result
            .map((id) => entities[id])
            .filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof questionSetService.getList>> =
      yield call(questionSetService.getList, {
        filters,
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });
    yield put(
      getListQuestionSetCompletedAction({
        questionSets: response.result.question_sets,
        totalCount: response.result.meta.total,
      })
    );
  } catch (e: any) {
    yield put(
      getListQuestionSetErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

function* deleteQuestionSetSaga(data: DeleteQuestionSetSagaPayloadType): any {
  const { questionSetId } = data.payload;
  try {
    const filters: QuestionSetActionPayloadType['filters'] = yield select(
      (state: AppState) => state.questionSet.filters
    );

    yield call(questionSetService.delete, questionSetId);
    yield put(deleteQuestionSetCompletedAction());
    toastService.showSuccess('Question Set deleted successfully');
    yield put(
      getListQuestionSetAction({
        filters,
      })
    );
  } catch (e: any) {
    toastService.showError((e?.errors && e.errors[0]?.message) || e?.message);
  }
}

function* questionSetSaga() {
  yield all([
    takeLatest(QuestionSetActionType.GET_LIST, getListQuestionSetSaga),
    takeLatest(
      QuestionSetActionType.DELETE_QUESTION_SET,
      deleteQuestionSetSaga
    ),
  ]);
}

export default questionSetSaga;
