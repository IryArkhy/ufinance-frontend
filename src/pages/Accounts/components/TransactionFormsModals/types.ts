import { AvailableCurrency } from '../../../../lib/api/accounts';
import { TransactionType } from '../../../../lib/api/transactions';

export type Option = {
  label: string;
  value: string;
};

export type AccountOption = {
  label: string;
  value: string;
  currency: AvailableCurrency;
  balance: number;
};

export type TransactionFormValues = {
  account: AccountOption;
  amount: number;
  category: Option;
  payee: Option;
  transactionType: Exclude<TransactionType, 'TRANSFER'>;
  tags: Option[];
  description: string;
  date: Date;
};

export type TransferFormValues = {
  sendingAccount: AccountOption;
  receivingAccount: AccountOption;
  fromAmount: number;
  toAmount: number;
  transactionType: Extract<TransactionType, 'TRANSFER'>;
  description: string;
  date: Date;
};
