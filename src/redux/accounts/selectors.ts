import { RootState } from '../store';

export const getAccounts = (store: RootState) => store.accounts.accounts;
export const getSelectedAccount = (store: RootState) => store.accounts.selectedAccount;
export const getTransactions = (store: RootState) => store.accounts.transactions;
