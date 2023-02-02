import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
} from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Account } from '../../../../lib/api/accounts';
import {
  CreateTransactionReqBody,
  CreateTransferReqBody,
  TransactionType,
  createTransaction,
  createTransfer,
} from '../../../../lib/api/transactions';
import { TransactionTypeToggleBtn } from '../TransactionTypeToggleBtn';

import { TransactionForm } from './TransactionForm';
import { TransferForm } from './TransferForm';
import { TransactionFormValues, TransferFormValues } from './types';
import {
  getAccountOption,
  getDefaultTransactionFormValues,
  getDefaultTransferFormValues,
  getOption,
} from './utils';

export type CreateTransactionModalProps = {
  accounts: Account[];
  isOpen: boolean;
  onClose: () => void;
  selectedAccount?: Account | null;
};

export function CreateTransactionModal({
  accounts,
  isOpen,
  onClose,
  selectedAccount,
}: CreateTransactionModalProps) {
  const [isAllTransactionOptionsVisible, setIsAllTransactionOptionsVisible] = React.useState(false);
  const [isAllTransferOptionsVisible, setIsAllTransferOptionsVisible] = React.useState(false);

  const accountsOptions = accounts.map(getAccountOption);

  const transactionDefaultValues = getDefaultTransactionFormValues(
    accountsOptions,
    undefined,
    selectedAccount,
  );
  const transferDefaultValues = getDefaultTransferFormValues(accountsOptions);

  const transactionTypeForm = useForm<{ type: TransactionType }>({
    defaultValues: { type: 'WITHDRAWAL' },
  });

  const watchedType = transactionTypeForm.watch('type');

  const transactionForm = useForm<TransactionFormValues>({
    defaultValues: transactionDefaultValues,
  });

  const transferForm = useForm<TransferFormValues>({
    defaultValues: transferDefaultValues,
  });

  const createNewTransaction = async (values: TransactionFormValues) => {
    const body: CreateTransactionReqBody = {
      fromAccountId: values.account.value,
      amount: values.amount,
      date: values.date.toISOString(),
      transactionType: watchedType as 'WITHDRAWAL' | 'DEPOSIT',
      categoryId: values.category.value || undefined,
      payeeId: values.payee.value || undefined,
      description: values.description || undefined,
      tagNames: values.tags.map((t) => t.label),
    };

    await createTransaction(body);
  };

  const createNewTransfer = async (values: TransferFormValues) => {
    const sameCurrencies = values.sendingAccount.currency === values.receivingAccount.currency;

    const body: CreateTransferReqBody = {
      fromAccountId: values.sendingAccount.value,
      toAccountId: values.receivingAccount.value,
      fromAccountAmount: values.fromAmount,
      toAccountAmount: sameCurrencies ? values.fromAmount : values.toAmount,
      date: values.date.toISOString(),
      description: values.description ?? undefined,
    };

    await createTransfer(body);
  };

  const returnSubmitFuntcion = () => {
    if (watchedType === 'TRANSFER') {
      return transferForm.handleSubmit(createNewTransfer);
    } else {
      return transactionForm.handleSubmit(createNewTransaction);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth keepMounted={false}>
      <DialogTitle>Create transaction</DialogTitle>
      <DialogContent>
        <Box width="100%" display="flex" flexDirection="column" gap={3} pt={2}>
          <Controller
            name="type"
            control={transactionTypeForm.control}
            render={({ field }) => (
              <FormControl>
                <TransactionTypeToggleBtn
                  value={field.value}
                  onChange={field.onChange}
                  options={['DEPOSIT', 'WITHDRAWAL', 'TRANSFER']}
                />
              </FormControl>
            )}
          />
          {watchedType === 'TRANSFER' ? (
            <TransferForm
              formData={transferForm}
              accounts={accounts}
              isAllOptionsVisible={isAllTransferOptionsVisible}
            />
          ) : (
            <TransactionForm
              formData={transactionForm}
              accounts={accounts}
              isAllOptionsVisible={isAllTransactionOptionsVisible}
            />
          )}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" my={2}>
          {watchedType === 'TRANSFER' ? (
            <Button
              startIcon={
                isAllTransferOptionsVisible ? <ExpandLessRounded /> : <ExpandMoreRounded />
              }
              onClick={() => setIsAllTransferOptionsVisible((current) => !current)}
            >
              {isAllTransferOptionsVisible ? 'Show less' : 'Show more'}
            </Button>
          ) : (
            <Button
              startIcon={
                isAllTransactionOptionsVisible ? <ExpandLessRounded /> : <ExpandMoreRounded />
              }
              onClick={() => setIsAllTransactionOptionsVisible((current) => !current)}
            >
              {isAllTransactionOptionsVisible ? 'Show less' : 'Show more'}
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton onClick={returnSubmitFuntcion()} color="success">
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
