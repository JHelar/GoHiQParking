import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers';


const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
    let store = createStore(
        rootReducer,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
    );
    let unsub = store.subscribe(() => {
        console.log(store.getState());
    });
    return {store, unsub}
}