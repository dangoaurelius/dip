import { createStore, applyMiddleware, compose } from 'redux';
// import createSagaMiddleware from 'redux-saga';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


import reducer from '../reducers';


// const sagaMiddleware = createSagaMiddleware();


// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

// const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware, navigationMiddleware));

const store = createStore(persistedReducer);


const persistor = persistStore(store);

export { persistor };

export default store;
