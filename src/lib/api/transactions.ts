import axiosInstance from '../axios';

import { Account, TotalBalance } from './accounts';
import { Category } from './categories';
import { Payee } from './payees';
import { Tag } from './tags';

export type TransactionType = 'WITHDRAWAL' | 'DEPOSIT' | 'TRANSFER';

export type TagOnTransaction = {
  id: string;
  assignedAt: string;
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
  fromAccount: Account;
  toAccount: Account;
};

export type CreateTransactionReqBody = {
  fromAccountId: string;
  amount: number;
  date: string;
  transactionType: Exclude<TransactionType, 'TRANSFER'>;
  description?: string;
  tagNames?: string[];
  categoryId?: string;
  payeeId?: string;
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

export type CreateTransferReqBody = {
  fromAccountId: string;
  toAccountId: string;
  fromAccountAmount: number;
  toAccountAmount: number;
  date: string; // ISOstring;
  description?: string;
};

export type CreateTransferResponse = {
  transaction: Transaction;

  fromAccount: {
    id: Account['id'];
    balance: Account['balance'];
  };
  toAccount: {
    id: Account['id'];
    balance: Account['balance'];
  };
};

export const createTransaction = async (data: CreateTransactionReqBody) => {
  return axiosInstance.post<CreateTransactionResponse>('api/transactions', data);
};

export const createTransfer = async (data: CreateTransferReqBody) => {
  return axiosInstance.post<CreateTransferResponse>('api/transactions/transfer', data);
};

export type UpdateTransactionReqBody = CreateTransactionReqBody;

export type UpdateTransactionResponse = {
  transaction: Transaction;
  totalBalance: TotalBalance;
};

export const updateTransaction = async (data: UpdateTransactionReqBody, id: string) => {
  return axiosInstance.put<UpdateTransactionResponse>(`api/transactions/${id}`, data);
};

export type UpdateTransferReqBody = CreateTransferReqBody;

export type UpdateTransferResponse = {
  transaction: Transaction;
  totalBalance: TotalBalance;
};

export const updateTransfer = async (data: UpdateTransferReqBody, id: string) => {
  return axiosInstance.put<UpdateTransferResponse>(`api/transactions/transfer/${id}`, data);
};

export type DeleteTransactionResponse = {
  transaction: Transaction;
  totalBalance: TotalBalance;
};

export type DeleteTransferResponse = DeleteTransactionResponse;

export const deleteTransaction = async (accountId: string, id: string) => {
  return axiosInstance.delete<DeleteTransactionResponse>(`api/transactions/${accountId}/${id}`);
};

export const deleteTransfer = async (accountId: string, id: string) => {
  return axiosInstance.delete<DeleteTransferResponse>(
    `api/transactions/transfer/${accountId}/${id}`,
  );
};
