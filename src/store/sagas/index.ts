import { all, fork } from 'redux-saga/effects';
import authSaga from './auth.saga';
import questionSetSaga from './questionSet.saga';

export default function* rootSaga() {
  yield all([fork(authSaga), fork(questionSetSaga)]);
}
