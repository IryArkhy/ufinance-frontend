import { createAsyncThunk } from '@reduxjs/toolkit';

import { Payee, createPayees, deletePayee, fetchPayees as getPayees } from '../../lib/api/payees';
import { ErrorData, handleError } from '../../lib/api/utils';

export const fetchPayees = createAsyncThunk<Payee[], undefined, { rejectValue: ErrorData }>(
  'payees/fetchPayees',
  async (_, thunkApi) => {
    try {
      const { payees } = (await getPayees()).data;

      return payees;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);

export const createNewPayees = createAsyncThunk<Payee[], string[], { rejectValue: ErrorData }>(
  'payees/createCategory',
  async (names, thunkApi) => {
    try {
      const { payees } = (await createPayees(names)).data;

      return payees;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);

export const removePayee = createAsyncThunk<Payee, string, { rejectValue: ErrorData }>(
  'payees/deleteCategory',
  async (id, thunkApi) => {
    try {
      const { deletedPayee } = (await deletePayee(id)).data;

      return deletedPayee;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);
