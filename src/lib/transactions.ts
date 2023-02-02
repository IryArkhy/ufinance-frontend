import { Transaction } from './api/transactions';

export const getTransactionAmountData = (
  transaction: Transaction,
): { color: string; sign: '+' | '-'; amount: number } => {
  if (transaction.type === 'DEPOSIT') {
    return { color: 'success.light', sign: '+', amount: transaction.amount };
  }

  return { color: 'error.light', sign: '-', amount: transaction.amount };
};
