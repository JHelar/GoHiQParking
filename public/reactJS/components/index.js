import 'babel-polyfill'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'

import rootReducer from './reducers'
import fetchParkingLots from './actions'

const loggerMiddleware = createLogger();
const store = createStore(
	rootReducer,
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
	)
);

let unsubLogger = store.subscribe(() => {
   console.log(store.getState());
});

store.dispatch(fetchParkingLots()).then(() => {
	console.log(store.getState());
});