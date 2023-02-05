import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  CreateTransactionReqBody,
  CreateTransferReqBody,
  TransactionType,
} from '../../../../lib/api/transactions';
import { ErrorData } from '../../../../lib/api/utils';
import { NotificationContext } from '../../../../lib/notifications';
import { getAccounts, getSelectedAccount } from '../../../../redux/accounts/selectors';
import { createNewTransaction, createNewTransfer } from '../../../../redux/accounts/thunks';
import { useDispatch, useSelector } from '../../../../redux/hooks';
import { TransactionTypeToggleBtn } from '../TransactionTypeToggleBtn';

import { TransactionForm } from './TransactionForm';
import { TransferForm } from './TransferForm';
import { TransactionFormValues, TransferFormValues } from './types';
import {
  getAccountOption,
  getDefaultTransactionFormValues,
  getDefaultTransferFormValues,
} from './utils';

export type CreateTransactionModalProps = {
  onClose: (isCancel?: boolean) => void;
};

export function CreateTransactionModal({ onClose }: CreateTransactionModalProps) {
  const { notifyError, notifySuccess } = React.useContext(NotificationContext);
  const accounts = useSelector(getAccounts);
  const selectedAccount = useSelector(getSelectedAccount);
  const dispatch = useDispatch();
  const [isAllTransactionOptionsVisible, setIsAllTransactionOptionsVisible] = React.useState(false);
  const [isAllTransferOptionsVisible, setIsAllTransferOptionsVisible] = React.useState(false);

  const accountsOptions = React.useMemo(() => accounts.data.map(getAccountOption), [accounts.data]);
  const [isLoading, setIsLoading] = React.useState(false);

  const transactionTypeForm = useForm<{ type: TransactionType }>({
    defaultValues: { type: 'WITHDRAWAL' },
  });

  const watchedType = transactionTypeForm.watch('type');

  const transactionForm = useForm<TransactionFormValues>({
    defaultValues: getDefaultTransactionFormValues(accountsOptions, undefined, selectedAccount),
  });

  const transferForm = useForm<TransferFormValues>({
    defaultValues: getDefaultTransferFormValues(accountsOptions, selectedAccount ?? undefined),
  });

  const resetFormValues = () => {
    transactionTypeForm.reset({ type: 'WITHDRAWAL' });
    transactionForm.reset(
      getDefaultTransactionFormValues(accountsOptions, undefined, selectedAccount),
    );
    transferForm.reset(getDefaultTransferFormValues(accountsOptions, selectedAccount ?? undefined));
  };

  React.useEffect(() => {
    resetFormValues();
  }, [selectedAccount]);

  React.useEffect(() => {
    if (watchedType !== 'TRANSFER') {
      transactionForm.setValue('transactionType', watchedType);
    }
  }, [watchedType]);

  React.useEffect(
    () => () => {
      resetFormValues();
    },
    [],
  );

  const createTransaction = async (values: TransactionFormValues) => {
    const body: CreateTransactionReqBody = {
      fromAccountId: values.account.value,
      amount: typeof values.amount === 'string' ? parseFloat(values.amount) : values.amount,
      date: values.date.toISOString(),
      transactionType: watchedType as 'WITHDRAWAL' | 'DEPOSIT',
      categoryId: values.category.value || undefined,
      payeeId: values.payee.value || undefined,
      description: values.description || undefined,
      tagNames: values.tags.map((t) => t.label),
    };

    setIsLoading(true);
    const resultAction = await dispatch(createNewTransaction(body));

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
      setIsLoading(false);
    } else {
      notifySuccess('Створено!');
      setIsLoading(false);
      onClose();
    }
  };

  const createTransfer = async (values: TransferFormValues) => {
    const sameCurrencies = values.sendingAccount.currency === values.receivingAccount.currency;
    const fromAmount =
      typeof values.fromAmount === 'string' ? parseFloat(values.fromAmount) : values.fromAmount;
    const toAmount = sameCurrencies ? values.fromAmount : values.toAmount;
    const toAmountAsFloat = typeof toAmount === 'string' ? parseFloat(toAmount) : toAmount;

    const body: CreateTransferReqBody = {
      fromAccountId: values.sendingAccount.value,
      toAccountId: values.receivingAccount.value,
      fromAccountAmount: fromAmount,
      toAccountAmount: toAmountAsFloat,
      date: values.date.toISOString(),
      description: values.description ?? undefined,
    };

    setIsLoading(true);
    const resultAction = await dispatch(createNewTransfer(body));

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
      setIsLoading(false);
    } else {
      notifySuccess('Створено!');
      setIsLoading(false);
      onClose();
    }
  };

  const returnSubmitFuntcion = () => {
    if (watchedType === 'TRANSFER') {
      return transferForm.handleSubmit(createTransfer);
    } else {
      return transactionForm.handleSubmit(createTransaction);
    }
  };

  const handleClose = async () => {
    resetFormValues();
    onClose(true);
  };

  return (
    <>
      <DialogTitle>Створити транзакцію</DialogTitle>
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
                  options={['WITHDRAWAL', 'DEPOSIT', 'TRANSFER']}
                  isTransferDisabled={accounts.data.length <= 1}
                />
              </FormControl>
            )}
          />
          {watchedType === 'TRANSFER' ? (
            <TransferForm
              formData={transferForm}
              accounts={accounts.data}
              isAllOptionsVisible={isAllTransferOptionsVisible}
            />
          ) : (
            <TransactionForm
              formData={transactionForm}
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
              {isAllTransferOptionsVisible ? 'Сховати' : 'Показати більше опцій'}
            </Button>
          ) : (
            <Button
              startIcon={
                isAllTransactionOptionsVisible ? <ExpandLessRounded /> : <ExpandMoreRounded />
              }
              onClick={() => setIsAllTransactionOptionsVisible((current) => !current)}
            >
              {isAllTransactionOptionsVisible ? 'Сховати' : 'Показати більше опцій'}
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={handleClose}>
          Відмінити
        </Button>
        <LoadingButton loading={isLoading} onClick={returnSubmitFuntcion()} color="success">
          Створити
        </LoadingButton>
      </DialogActions>
    </>
  );
}
