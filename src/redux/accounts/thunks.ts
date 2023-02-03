import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  Account,
  CreateAccountReqBody,
  CreateAccountResponse,
  UpdateAccountReqBody,
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from '../../lib/api/accounts';
import {
  CreateTransactionReqBody,
  CreateTransactionResponse,
  CreateTransferReqBody,
  CreateTransferResponse,
  DeleteTransactionResponse,
  DeleteTransferResponse,
  GetTransactionsResponse,
  UpdateTransactionReqBody,
  UpdateTransactionResponse,
  UpdateTransferReqBody,
  UpdateTransferResponse,
  createTransaction,
  createTransfer,
  deleteTransaction,
  deleteTransfer,
  getTransactions,
  updateTransaction,
  updateTransfer,
} from '../../lib/api/transactions';
import { ErrorData, handleError } from '../../lib/api/utils';

export const fetchAccounts = createAsyncThunk<Account[], undefined, { rejectValue: ErrorData }>(
  'accounts/fetchAccounts',
  async (_, thunkApi) => {
    try {
      const response = (await getAccounts()).data;

      return response.accounts;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);

export const createNewAccount = createAsyncThunk<
  CreateAccountResponse['account'],
  CreateAccountReqBody,
  { rejectValue: ErrorData }
>('accounts/createAccount', async (data, thunkApi) => {
  try {
    const response = await createAccount(data);

    return response.data.account;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const editAccount = createAsyncThunk<
  Account,
  { data: UpdateAccountReqBody; accountId: string },
  { rejectValue: ErrorData }
>('accounts/editAccount', async (data, thunkApi) => {
  try {
    const response = await updateAccount(data.accountId, data.data);

    return response.data.account;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const removeAccount = createAsyncThunk<Account, string, { rejectValue: ErrorData }>(
  'accounts/deleteAccount',
  async (id, thunkApi) => {
    try {
      const { deletedAccount } = (await deleteAccount(id)).data;

      return deletedAccount;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);

export const fetchTransactions = createAsyncThunk<
  GetTransactionsResponse & { reset: boolean },
  { accountId: string; data: { cursor?: string; limit?: number } },
  { rejectValue: ErrorData }
>('accounts/fetchAccountTransactions', async ({ accountId, data }, thunkApi) => {
  try {
    const response = (await getTransactions(accountId, data)).data;

    return { ...response, reset: !data?.cursor };
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const createNewTransaction = createAsyncThunk<
  CreateTransactionResponse,
  CreateTransactionReqBody,
  { rejectValue: ErrorData }
>('accounts/createTransaction', async (data, thunkApi) => {
  try {
    const response = (await createTransaction(data)).data;

    return response;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const createNewTransfer = createAsyncThunk<
  CreateTransferResponse,
  CreateTransferReqBody,
  { rejectValue: ErrorData }
>('accounts/createTransfer', async (data, thunkApi) => {
  try {
    const response = (await createTransfer(data)).data;

    return response;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const editTransaction = createAsyncThunk<
  UpdateTransactionResponse,
  { data: UpdateTransactionReqBody; id: string },
  { rejectValue: ErrorData }
>('accounts/editTransaction', async ({ data, id }, thunkApi) => {
  try {
    const response = (await updateTransaction(data, id)).data;

    return response;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const editTransfer = createAsyncThunk<
  UpdateTransferResponse,
  { data: UpdateTransferReqBody; id: string },
  { rejectValue: ErrorData }
>('accounts/editTransfer', async ({ data, id }, thunkApi) => {
  try {
    const response = (await updateTransfer(data, id)).data;

    return response;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const removeTransaction = createAsyncThunk<
  DeleteTransactionResponse,
  { accountId: string; id: string },
  { rejectValue: ErrorData }
>('accounts/removeTransaction', async ({ accountId, id }, thunkApi) => {
  try {
    const response = (await deleteTransaction(accountId, id)).data;

    return response;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const removeTransfer = createAsyncThunk<
  DeleteTransferResponse,
  { accountId: string; id: string },
  { rejectValue: ErrorData }
>('accounts/removeTransfer', async ({ accountId, id }, thunkApi) => {
  try {
    const response = (await deleteTransfer(accountId, id)).data;

    return response;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});
