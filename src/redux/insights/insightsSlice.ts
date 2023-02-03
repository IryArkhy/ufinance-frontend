import { createSlice } from '@reduxjs/toolkit';

import {
  GetCurrentMonthTransactionsResponse,
  GetCurrentMonthsStatisticsResponse,
  GetOverviewResponse,
} from '../../lib/api/insights';
import { ErrorData } from '../../lib/api/utils';

import { fetchCurrentMonthTransactions, fetchOverview, fetchStatistics } from './thunks';

type InsightsSliceState = {
  overview: {
    data: GetOverviewResponse | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: null | ErrorData;
  };
  statistics: {
    data: GetCurrentMonthsStatisticsResponse | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: null | ErrorData;
  };
  currentMonthTransactions: {
    data: GetCurrentMonthTransactionsResponse | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: null | ErrorData;
  };
};

const initialState: InsightsSliceState = {
  overview: {
    data: null,
    loading: 'idle',
    error: null,
  },
  statistics: {
    data: null,
    loading: 'idle',
    error: null,
  },
  currentMonthTransactions: {
    data: null,
    loading: 'idle',
    error: null,
  },
};

export const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    resetState: (state) => {
      state.overview = initialState.overview;
      state.currentMonthTransactions = initialState.currentMonthTransactions;
      state.statistics = initialState.statistics;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOverview.fulfilled, (state, action) => {
      state.overview.data = action.payload;
      state.overview.loading = 'succeeded';
      state.overview.error = null;
    });
    builder.addCase(fetchOverview.pending, (state) => {
      state.overview.loading = 'pending';
    });
    builder.addCase(fetchOverview.rejected, (state, action) => {
      state.overview.error = action.payload ?? null;
      state.overview.loading = 'failed';
    });
    builder.addCase(fetchStatistics.fulfilled, (state, action) => {
      state.statistics.data = action.payload;
      state.statistics.loading = 'succeeded';
      state.statistics.error = null;
    });
    builder.addCase(fetchStatistics.pending, (state) => {
      state.statistics.loading = 'pending';
    });
    builder.addCase(fetchStatistics.rejected, (state, action) => {
      state.statistics.error = action.payload ?? null;
      state.statistics.loading = 'failed';
    });
    builder.addCase(fetchCurrentMonthTransactions.fulfilled, (state, action) => {
      state.currentMonthTransactions.loading = 'succeeded';
      state.currentMonthTransactions.data = action.payload;
      state.currentMonthTransactions.error = null;
    });
    builder.addCase(fetchCurrentMonthTransactions.pending, (state) => {
      state.currentMonthTransactions.loading = 'pending';
    });
    builder.addCase(fetchCurrentMonthTransactions.rejected, (state, action) => {
      state.currentMonthTransactions.error = action.payload ?? null;
      state.currentMonthTransactions.loading = 'failed';
    });
  },
});

export const { resetState: resetInsightsState } = insightsSlice.actions;

export const insightsReducer = insightsSlice.reducer;
