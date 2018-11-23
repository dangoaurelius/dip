import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const middlewares = composeWithDevTools(
  applyMiddleware(
    sagaMiddleware,
  ),
);

const store = createStore(persistedReducer, middlewares);

const persistor = persistStore(store);

export { persistor };
// persistor.purge();
export default store;
