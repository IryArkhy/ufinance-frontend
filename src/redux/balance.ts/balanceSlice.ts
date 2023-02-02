import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { TotalBalance } from '../../lib/api/accounts';
import { ErrorData } from '../../lib/api/utils';

import { fetchBalance } from './thunks';

type BalanceSliceState = {
  data: TotalBalance | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: null | ErrorData;
};

const initialState: BalanceSliceState = {
  data: null,
  loading: 'idle',
  error: null,
};

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<TotalBalance>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBalance.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = 'succeeded';
      state.error = null;
    });
    builder.addCase(fetchBalance.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchBalance.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });
  },
});

export const { setBalance } = balanceSlice.actions;

export const balanceReducer = balanceSlice.reducer;
