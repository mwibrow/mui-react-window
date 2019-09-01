import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/app/App';
import * as serviceWorker from './serviceWorker';

import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'

import * as reducers from './store/reducers'
import rootSaga from './store/sagas'


const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]


const stateTransformer = state => {
  return JSON.parse(JSON.stringify(state))
}
const logger = createLogger({ stateTransformer })
middlewares.push(logger)


const store = createStore(
  combineReducers(reducers),
  applyMiddleware(...middlewares)
)

sagaMiddleware.run(rootSaga)

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
