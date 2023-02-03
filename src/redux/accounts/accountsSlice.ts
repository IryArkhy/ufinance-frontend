import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { sortBy } from 'lodash';

import { Account } from '../../lib/api/accounts';
import { Transaction } from '../../lib/api/transactions';
import { ErrorData } from '../../lib/api/utils';

import {
  createNewAccount,
  createNewTransaction,
  createNewTransfer,
  editAccount,
  editTransaction,
  editTransfer,
  fetchAccounts,
  fetchTransactions,
  removeAccount,
  removeTransaction,
  removeTransfer,
} from './thunks';

type AccountSliceState = {
  accounts: {
    data: Account[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: null | ErrorData;
  };
  selectedAccount: Account | null;
  transactions: {
    data: Transaction[];
    count: number;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: null | ErrorData;
  };
};

const initialState: AccountSliceState = {
  accounts: {
    data: [],
    loading: 'idle',
    error: null,
  },
  selectedAccount: null,
  transactions: {
    data: [],
    count: 0,
    loading: 'idle',
    error: null,
  },
};

export const accountsSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setSelectedAccount: (state, action: PayloadAction<Account>) => {
      state.selectedAccount = action.payload;
      state.transactions.data = [];
    },
    resetTransactions: (state) => {
      state.transactions = initialState.transactions;
    },
    resetState: (state) => {
      state.accounts = initialState.accounts;
      state.selectedAccount = initialState.selectedAccount;
      state.transactions = initialState.transactions;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccounts.fulfilled, (state, action) => {
      state.accounts.data = action.payload;
      const { selectedAccount } = state;
      if (selectedAccount) {
        const account = action.payload.find((acc) => acc.id === selectedAccount.id);
        if (account) state.selectedAccount = account;
      }
      state.accounts.loading = 'succeeded';
      state.accounts.error = null;
    });
    builder.addCase(fetchAccounts.pending, (state) => {
      state.accounts.loading = 'pending';
    });
    builder.addCase(fetchAccounts.rejected, (state, action) => {
      state.accounts.error = action.payload ?? null;
      state.accounts.loading = 'failed';
    });

    builder.addCase(createNewAccount.fulfilled, (state, action) => {
      state.accounts.data = [...state.accounts.data, action.payload];
      state.accounts.loading = 'succeeded';
      state.accounts.error = null;
    });
    builder.addCase(createNewAccount.pending, (state) => {
      state.accounts.loading = 'pending';
    });
    builder.addCase(createNewAccount.rejected, (state, action) => {
      state.accounts.error = action.payload ?? null;
      state.accounts.loading = 'failed';
    });

    builder.addCase(editAccount.fulfilled, (state, { payload }) => {
      state.accounts.data = state.accounts.data.map((account) =>
        account.id === payload.id ? payload : account,
      );
      state.accounts.loading = 'succeeded';
      state.accounts.error = null;
    });
    builder.addCase(editAccount.pending, (state) => {
      state.accounts.loading = 'pending';
    });
    builder.addCase(editAccount.rejected, (state, action) => {
      state.accounts.error = action.payload ?? null;
      state.accounts.loading = 'failed';
    });

    builder.addCase(removeAccount.fulfilled, (state, { payload }) => {
      state.accounts.data = [...state.accounts.data].filter((account) => account.id !== payload.id);
      state.accounts.loading = 'succeeded';
      state.accounts.error = null;
    });
    builder.addCase(removeAccount.pending, (state) => {
      state.accounts.loading = 'pending';
    });
    builder.addCase(removeAccount.rejected, (state, action) => {
      state.accounts.error = action.payload ?? null;
      state.accounts.loading = 'failed';
    });

    builder.addCase(fetchTransactions.fulfilled, (state, { payload }) => {
      state.transactions.data = payload.reset
        ? payload.transactions
        : [...state.transactions.data, ...payload.transactions];
      state.transactions.count = payload.count;
      state.transactions.loading = 'succeeded';
      state.transactions.error = null;
    });

    builder.addCase(fetchTransactions.pending, (state) => {
      state.transactions.loading = 'pending';
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.transactions.error = action.payload ?? null;
      state.transactions.loading = 'failed';
    });

    builder.addCase(createNewTransaction.fulfilled, (state, { payload }) => {
      const { transactions, selectedAccount } = state;
      const { transaction } = payload;
      state.transactions.data =
        selectedAccount?.id === transaction.fromAccountId
          ? [transaction, ...transactions.data]
          : transactions.data;

      state.accounts.data = state.accounts.data.map((account) =>
        account.id === payload.accountBalance.accountId
          ? { ...account, balance: payload.accountBalance.balance }
          : account,
      );
      state.transactions.loading = 'succeeded';
      state.transactions.error = null;
    });
    builder.addCase(createNewTransaction.pending, (state) => {
      state.transactions.loading = 'pending';
    });
    builder.addCase(createNewTransaction.rejected, (state, action) => {
      state.transactions.error = action.payload ?? null;
      state.transactions.loading = 'failed';
    });

    builder.addCase(createNewTransfer.fulfilled, (state, { payload }) => {
      const { transactions, selectedAccount } = state;
      const { transaction } = payload;
      state.transactions.data =
        selectedAccount?.id === transaction.fromAccountId ||
        selectedAccount?.id === transaction.toAccountId
          ? [transaction, ...transactions.data]
          : transactions.data;

      state.accounts.data = state.accounts.data.map((account) => {
        if (account.id === payload.fromAccount.id) {
          return { ...account, balance: payload.fromAccount.balance };
        }

        if (account.id === payload.toAccount.id) {
          return { ...account, balance: payload.toAccount.balance };
        }

        return account;
      });

      state.transactions.loading = 'succeeded';
      state.transactions.error = null;
    });
    builder.addCase(createNewTransfer.pending, (state) => {
      state.transactions.loading = 'pending';
    });
    builder.addCase(createNewTransfer.rejected, (state, action) => {
      state.transactions.error = action.payload ?? null;
      state.transactions.loading = 'failed';
    });

    // + Refetch accounts after
    builder.addCase(editTransaction.fulfilled, (state, { payload }) => {
      state.transactions.data = state.transactions.data.map((t) =>
        t.id === payload.transaction.id ? payload.transaction : t,
      );

      state.transactions.data = state.transactions.data.find((t) => t.id === payload.transaction.id)
        ? state.transactions.data
        : sortBy([payload.transaction, ...state.transactions.data], (t) => new Date(t.date));

      state.transactions.loading = 'succeeded';
      state.transactions.error = null;
    });
    builder.addCase(editTransaction.pending, (state) => {
      state.transactions.loading = 'pending';
    });
    builder.addCase(editTransaction.rejected, (state, action) => {
      state.transactions.error = action.payload ?? null;
      state.transactions.loading = 'failed';
    });

    // + refetch accounts after
    builder.addCase(editTransfer.fulfilled, (state, { payload }) => {
      const { transactions, selectedAccount } = state;
      const { transaction } = payload;

      state.transactions.data =
        selectedAccount?.id === transaction.fromAccountId ||
        selectedAccount?.id === transaction.toAccountId
          ? sortBy([payload.transaction, ...state.transactions.data], (t) => new Date(t.date))
          : transactions.data;

      state.transactions.loading = 'succeeded';
      state.transactions.error = null;
    });
    builder.addCase(editTransfer.pending, (state) => {
      state.transactions.loading = 'pending';
    });
    builder.addCase(editTransfer.rejected, (state, action) => {
      state.transactions.error = action.payload ?? null;
      state.transactions.loading = 'failed';
    });

    builder.addCase(removeTransaction.fulfilled, (state, { payload }) => {
      state.transactions.data = state.transactions.data.filter(
        (t) => t.id !== payload.transaction.id,
      );

      state.accounts.data = state.accounts.data.map((a) =>
        a.id === payload.transaction.fromAccountId ? payload.updatedAccount : a,
      );

      state.transactions.loading = 'succeeded';
      state.transactions.error = null;
    });
    builder.addCase(removeTransaction.pending, (state) => {
      state.transactions.loading = 'pending';
    });
    builder.addCase(removeTransaction.rejected, (state, action) => {
      state.transactions.error = action.payload ?? null;
      state.transactions.loading = 'failed';
    });

    builder.addCase(removeTransfer.fulfilled, (state, { payload }) => {
      state.transactions.data = state.transactions.data.filter(
        (t) => t.id !== payload.transaction.id,
      );

      state.accounts.data = state.accounts.data.map((a) => {
        if (a.id === payload.fromAccount.id) {
          return payload.fromAccount;
        }

        if (a.id === payload.toAccount.id) {
          return payload.toAccount;
        }

        return a;
      });

      state.transactions.loading = 'succeeded';
      state.transactions.error = null;
    });
    builder.addCase(removeTransfer.pending, (state) => {
      state.transactions.loading = 'pending';
    });
    builder.addCase(removeTransfer.rejected, (state, action) => {
      state.transactions.error = action.payload ?? null;
      state.transactions.loading = 'failed';
    });
  },
});

export const {
  setSelectedAccount,
  resetState: resetAccountsState,
  resetTransactions,
} = accountsSlice.actions;

export const accountsReducer = accountsSlice.reducer;
