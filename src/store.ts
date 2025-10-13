import type { Reducer } from '@reduxjs/toolkit';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import storageSession from 'redux-persist/lib/storage/session';

import authReducer from '@/slices/authSlice';
import chatReducer from '@/slices/chatSlice';

const persistConfig = {
	key: 'root',
	storage: storageSession,
};

const appReducer = combineReducers({
	auth: authReducer,
	chats: chatReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const persistedReducer = persistReducer(
	{
		transforms: [
			encryptTransform({
				secretKey: import.meta.env.VITE_SECRET_TRANSFORM_ENCRYPTION,
				/**
				 * Called when transform fails (e.g. bad data).
				 *
				 * The function takes in the error as an argument and should return
				 * a promise that resolves to the transformed state.
				 *
				 * If the function does not return anything, the transform will be
				 * considered a failure and the entire state will be rejected.
				 *
				 * @param {Error} error - The error that occurred during transform.
				 * @returns {Promise<Serialized>} - A promise that resolves to the transformed state.
				 */
				onError: function () {
					// Handle the error.
				},
			}),
		],
		...persistConfig,
	},
	appReducer as Reducer,
);

export const store = configureStore({
	reducer: persistedReducer,

	/**
	 * This middleware is used to disable the serializable check for the
	 * persist/PERSIST and persist/REHYDRATE actions. This is necessary because
	 * the persist library stores the state in a non-serializable format,
	 * which would cause the serializable check to throw an error.
	 */
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	devTools: import.meta.env.VITE_API_NODE_ENV === 'development' ? true : false,
});

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
