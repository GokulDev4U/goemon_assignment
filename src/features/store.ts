// src/feature/store.ts
import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';
import tokenReducer from './tokenSlice';
import orderBookReducer from './orderBookSlice';
import transactionReducer from './transactionSlice';
import darkModeReducer from './darkModeSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    token: tokenReducer,
    orderBook: orderBookReducer,
    transaction: transactionReducer,
    darkMode: darkModeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
