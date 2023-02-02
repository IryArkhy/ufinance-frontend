import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  GetCurrentMonthTransactionsResponse,
  GetCurrentMonthsStatisticsResponse,
  GetOverviewResponse,
  getMonthLastTransactions,
  getOverview,
  getStatistics,
} from '../../lib/api/insights';
import { ErrorData, handleError } from '../../lib/api/utils';

export const fetchOverview = createAsyncThunk<
  GetOverviewResponse,
  undefined,
  { rejectValue: ErrorData }
>('insights/fetchOverview', async (_, thunkApi) => {
  try {
    const overview = (await getOverview()).data;

    return overview;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const fetchStatistics = createAsyncThunk<
  GetCurrentMonthsStatisticsResponse,
  undefined,
  { rejectValue: ErrorData }
>('insights/fetchStatistics', async (_, thunkApi) => {
  try {
    const stats = (await getStatistics()).data;

    return stats;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const fetchCurrentMonthTransactions = createAsyncThunk<
  GetCurrentMonthTransactionsResponse,
  undefined,
  { rejectValue: ErrorData }
>('insights/fetchCurrentMonthTransactions', async (_, thunkApi) => {
  try {
    const stats = (await getMonthLastTransactions()).data;

    return stats;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});
