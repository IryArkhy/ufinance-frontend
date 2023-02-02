import axiosInstance from '../axios';

import { TotalBalance } from './accounts';
import { Category } from './categories';
import { Payee } from './payees';
import { Tag } from './tags';

export type TransactionType = 'WITHDRAWAL' | 'DEPOSIT' | 'TRANSFER';

export type TagOnTransaction = {
  id: string;
  assignedAt: '2023-02-01T20:42:10.876Z';
  tagId: string;
  transactionId: string;
  tag: Tag;
};

export type Transaction = {
  id: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
  toAccountAmount: number;
  description: string;
  date: string;
  type: TransactionType;
  userId: string;
  fromAccountId: string;
  toAccountId: string | null;
  categoryId: string | null;
  payeeId: string | null;
  category: Category | null;
  payee: Payee | null;
  tags: TagOnTransaction[];
};

export type CreateTransactionReqBody = {
  fromAccountId: string;
  amount: number;
  date: string;
  transactionType: Exclude<TransactionType, 'TRANSFER'>;
  description: string;
  tagNames: string[];
  categoryId: string;
  payeeId: string;
};

export type CreateTransactionResponse = {
  transaction: Transaction;
  totalBalance: TotalBalance;
  accountBalance: {
    accountId: string;
    balance: number;
  };
};

export type GetTransactionsResponse = {
  transactions: Transaction[];
  offset: number | null;
  limit: number;
};

export const getTransactions = async (
  accountId: string,
  data: { offset?: number; limit?: number },
) => {
  const offset = data.offset ? `offset=${data.offset}` : '';
  const limit = data.limit ? `limit=${data.limit}` : '';
  const query = '?'.concat(offset).concat(`&${limit}`);

  return await axiosInstance.get<GetTransactionsResponse>(
    `api/transactions/${accountId}${query !== '?' ? query : ''}`,
    {
      data,
    },
  );
};

// export const createTransaction = async () => {};
// export const createTransfer = async () => {};
// export const updateTransaction = async () => {};
// export const updateTransfer = async () => {};
// export const deleteTransaction = async () => {};
// export const deleteTransfer = async () => {};
