import { call, put, select, takeLatest } from 'redux-saga/effects'
import actions from './actions'
import * as effects from './side-effects'
import * as selectors from './reducer'

const fetchData = () => ({ type: actions.FETCH_DATA })

function* fetchDataSaga (action) {
  yield put({ type: actions.LOADING_DATA, payload: { loadingData: true }})
  const oldData = yield select(selectors.getData)
  const { data, hasMoreData }= yield call(effects.fetchData, { index: oldData.length, pageSize: 50 })
  yield put({ type: actions.DATA_FETCHED, payload: {
    data: data.length ? oldData.concat(data) : oldData, hasMoreData
  }})
  yield put({ type: actions.LOADING_DATA, payload: { loadingData: false }})
}

const sagas = [
  takeLatest(actions.FETCH_DATA, fetchDataSaga)
]

export {
  sagas as default,
  fetchData,
  fetchDataSaga,
}