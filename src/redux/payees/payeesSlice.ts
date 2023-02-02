import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Payee } from '../../lib/api/payees';
import { ErrorData } from '../../lib/api/utils';

import { createNewPayees, fetchPayees, removePayee } from './thunks';

type PayeesSliceState = {
  payees: Payee[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: null | ErrorData;
};

const initialState: PayeesSliceState = {
  payees: [],
  loading: 'idle',
  error: null,
};

export const payeesSlice = createSlice({
  name: 'payees',
  initialState,
  reducers: {
    setPayees: (state, action: PayloadAction<Payee[]>) => {
      state.payees = action.payload;
    },
    addPayee: (state, action: PayloadAction<Payee>) => {
      state.payees = [...state.payees, action.payload];
    },
    deletePayee: (state, action: PayloadAction<{ id: string }>) => {
      state.payees = [...state.payees].filter((c) => c.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPayees.fulfilled, (state, action) => {
      state.payees = action.payload;
      state.loading = 'succeeded';
      state.error = null;
    });
    builder.addCase(fetchPayees.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchPayees.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });

    builder.addCase(createNewPayees.fulfilled, (state, action) => {
      state.payees = action.payload;
      state.loading = 'succeeded';
      state.error = null;
    });
    builder.addCase(createNewPayees.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(createNewPayees.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });

    builder.addCase(removePayee.fulfilled, (state, action) => {
      state.payees = [...state.payees].filter((cat) => cat.id !== action.payload.id);
      state.loading = 'succeeded';
      state.error = null;
    });
    builder.addCase(removePayee.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(removePayee.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });
  },
});

export const { addPayee, deletePayee, setPayees } = payeesSlice.actions;

export const payeesReducer = payeesSlice.reducer;
