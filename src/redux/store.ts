import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import { accountsReducer } from './accounts/accountsSlice';
import { balanceReducer } from './balance/balanceSlice';
import { categoriesReducer } from './categories/categoriesSlice';
import { insightsReducer } from './insights/insightsSlice';
import { payeesReducer } from './payees/payeesSlice';
import { tagsReducer } from './tags/tagsSlice';
import { userReducer } from './user/userSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  balance: balanceReducer,
  categories: categoriesReducer,
  payees: payeesReducer,
  tags: tagsReducer,
  insights: insightsReducer,
  accounts: accountsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
