// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Persist configuration (whitelist auth and Theme reducers)
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'Theme'],  // Example: Persisting auth and Theme only
};

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Creating the store with persistedReducer
const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],  // Ignore redux-persist actions
            },
        }),
});

// Create persistor
export const persistor = persistStore(store);

// TypeScript types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
