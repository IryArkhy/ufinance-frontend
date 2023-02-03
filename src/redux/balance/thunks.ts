import { createAsyncThunk } from '@reduxjs/toolkit';

import { TotalBalance } from '../../lib/api/accounts';
import { getTotalBalance } from '../../lib/api/insights';
import { ErrorData, handleError } from '../../lib/api/utils';

export const fetchBalance = createAsyncThunk<TotalBalance, undefined, { rejectValue: ErrorData }>(
  'balance/fetchBalance',
  async (_, thunkApi) => {
    try {
      const { balance } = (await getTotalBalance()).data;

      return balance;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);
