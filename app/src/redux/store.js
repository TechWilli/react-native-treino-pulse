import thunk from 'redux-thunk'
import RootReducer from './RootReducer'
import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import AsyncStorage from '@react-native-community/async-storage'

const persistConfig = {
	key: 'primary',
	keyPrefix: '',
	storage: AsyncStorage,
	stateReconciler: autoMergeLevel2
};

const persistedReducer = persistReducer(persistConfig, RootReducer)

const middlewares = [
	thunk
]

const store = createStore(
	persistedReducer,
	applyMiddleware(...middlewares)
);

const persistor = persistStore(store);

export {
	store,
	persistor
}