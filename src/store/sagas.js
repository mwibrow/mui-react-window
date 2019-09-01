import { all } from 'redux-saga/effects'

import app, * as appSagas from './app/sagas'

export default function* rootSaga() {
  yield all([...app])
}

export { appSagas }