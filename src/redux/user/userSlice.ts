import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ErrorData } from '../../lib/api/utils';

import { changePassword, fetchUser, login, signUp } from './thunks';
import { User } from './types';

type UserSliceState = {
  data: null | User;
  token: null | string;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: null | ErrorData;
};

const initialState: UserSliceState = {
  token: null,
  data: null,
  loading: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
      state.token = null;
      state.error = null;
      state.loading = 'idle';
    },
    setLoading: (state, action: PayloadAction<UserSliceState['loading']>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.data = action.payload.user;
      state.loading = 'succeeded';
      state.error = null;
    });

    builder.addCase(login.pending, (state) => {
      state.loading = 'pending';
    });

    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });

    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = 'succeeded';
    });

    builder.addCase(fetchUser.pending, (state) => {
      state.loading = 'pending';
    });

    builder.addCase(fetchUser.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });

    builder.addCase(signUp.fulfilled, (state, { payload }) => {
      state.token = payload.token;
      state.data = payload.user;
      state.loading = 'succeeded';
    });

    builder.addCase(signUp.pending, (state) => {
      state.loading = 'pending';
    });

    builder.addCase(signUp.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });

    builder.addCase(changePassword.fulfilled, (state, { payload }) => {
      state.token = payload.token;
      state.loading = 'succeeded';
    });

    builder.addCase(changePassword.pending, (state) => {
      state.loading = 'pending';
    });

    builder.addCase(changePassword.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });
  },
});

export const { setUser, setToken, clearUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
