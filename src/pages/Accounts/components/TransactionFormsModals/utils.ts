import { Account } from '../../../../lib/api/accounts';
import { Category } from '../../../../lib/api/categories';
import { Payee } from '../../../../lib/api/payees';
import { Tag } from '../../../../lib/api/tags';
import { Transaction, TransactionType } from '../../../../lib/api/transactions';

import { AccountOption, Option, TransactionFormValues, TransferFormValues } from './types';

export const getOption = (value: Category | Payee | Tag): Option => ({
  label: value.name,
  value: value.id,
});
export const getAccountOption = (value: Account): AccountOption => ({
  label: value.name,
  value: value.id,
  currency: value.currency,
  balance: value.balance,
});

export const getDefaultTransactionFormValues = (
  accountOptions: AccountOption[],
  transaction?: Transaction & { type: Exclude<TransactionType, 'TRANSFER'> },
  selectedAccount?: Account | null,
) => {
  const defaultOption = { label: '', value: '' };

  const defaultFormValues: TransactionFormValues = {
    account: selectedAccount ? getAccountOption(selectedAccount) : accountOptions[0],
    amount: 0,
    category: { ...defaultOption },
    payee: { ...defaultOption },
    transactionType: 'WITHDRAWAL',
    tags: [],
    description: '',
    date: new Date(),
  };

  if (!transaction) return defaultFormValues;

  defaultFormValues.account =
    accountOptions.find((acc) => acc.value === transaction.fromAccountId) ?? accountOptions[0];
  defaultFormValues.amount = transaction.amount;
  defaultFormValues.transactionType = transaction.type;
  defaultFormValues.date = new Date(transaction.date);

  if (transaction?.category) {
    defaultFormValues.category = getOption(transaction.category);
  }

  if (transaction?.payee) {
    defaultFormValues.payee = getOption(transaction.payee);
  }

  if (transaction?.tags?.length) {
    defaultFormValues.tags = transaction.tags.map(({ tag }) => getOption(tag));
  }

  if (transaction?.description) {
    defaultFormValues.description = transaction.description;
  }

  return defaultFormValues;
};

export const getDefaultTransferFormValues = (
  accountOptions: AccountOption[],
  selectedAccount?: Account,
  transaction?: Transaction & { type: Extract<TransactionType, 'TRANSFER'> },
) => {
  const defaultAccountOption = { label: '', value: '', currency: 'UAH', balance: 0 };
  const defaultFormValues: TransferFormValues = {
    sendingAccount: selectedAccount ? getAccountOption(selectedAccount) : accountOptions[0],
    receivingAccount:
      accountOptions.filter((o) => o.value !== selectedAccount?.id)[0] || defaultAccountOption,
    fromAmount: 0,
    toAmount: 0,
    transactionType: 'TRANSFER',
    description: '',
    date: new Date(),
  };

  if (!transaction) return defaultFormValues;

  const sendingAccount = accountOptions.find(
    (option) => option.value === transaction.fromAccountId,
  )!;

  const receivingAccount = accountOptions.find(
    (option) => option.value === transaction.toAccountId,
  )!;

  defaultFormValues.sendingAccount = sendingAccount;
  defaultFormValues.receivingAccount = receivingAccount;
  defaultFormValues.fromAmount = transaction.amount;
  defaultFormValues.toAmount = transaction.toAccountAmount;
  defaultFormValues.transactionType = transaction.type;
  defaultFormValues.date = new Date(transaction.date);

  if (transaction.description) {
    defaultFormValues.description = transaction.description;
  }

  return defaultFormValues;
};
