import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { uk } from 'date-fns/locale';
import { isEqual } from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Account } from '../../../../lib/api/accounts';
import {
  Transaction,
  TransactionType,
  UpdateTransferReqBody,
} from '../../../../lib/api/transactions';
import { ErrorData } from '../../../../lib/api/utils';
import { NotificationContext } from '../../../../lib/notifications';
import { editTransfer, fetchAccounts } from '../../../../redux/accounts/thunks';
import { fetchBalance } from '../../../../redux/balance/thunks';
import { useDispatch } from '../../../../redux/hooks';
import { TransactionTypeToggleBtn } from '../TransactionTypeToggleBtn';

import { TransferFormValues } from './types';
import {
  getAccountOption,
  getDefaultTransferFormValues,
  validateAbilityToWithdrawAmount,
  validateFormAmount,
  validateTransferAccounts,
} from './utils';

export type FormTransferType = Omit<Transaction, 'type'> & {
  type: Extract<TransactionType, 'TRANSFER'>;
};

export type UpdateTransferModalProps = {
  transaction: Omit<Transaction, 'type'> & { type: Extract<TransactionType, 'TRANSFER'> };
  accounts: Account[];
  isOpen: boolean;
  onClose: () => void;
};

export function UpdateTransferModal({
  transaction,
  isOpen,
  onClose,
  accounts,
}: UpdateTransferModalProps) {
  const dispatch = useDispatch();
  const { notifyError, notifySuccess, notifyWarning } = React.useContext(NotificationContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAllOptionsVisible, setIsAllOptionsVisible] = React.useState(false);
  const accountsOptions = accounts.map(getAccountOption);
  const defaultValues = getDefaultTransferFormValues(accountsOptions, undefined, transaction);

  const {
    control,
    handleSubmit: onSubmit,
    watch,
  } = useForm<TransferFormValues>({
    defaultValues,
  });

  const watchSendingAccount = watch('sendingAccount');
  const watchReceivingAccount = watch('receivingAccount');

  const handleUpdateTransnsfer = async (values: UpdateTransferReqBody) => {
    setIsLoading(true);
    const resultAction = await dispatch(editTransfer({ data: values, id: transaction.id }));

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
      setIsLoading(false);
    } else {
      await dispatch(fetchBalance());
      notifySuccess('Трансфер оновлено');
      setIsLoading(false);
      onClose();
    }
  };

  const handleSubmit = async (values: TransferFormValues) => {
    const sameCurrencies = values.sendingAccount.currency === values.receivingAccount.currency;
    const fromAmount =
      typeof values.fromAmount === 'string' ? parseFloat(values.fromAmount) : values.fromAmount;
    const toAmount =
      typeof values.toAmount === 'string' ? parseFloat(values.toAmount) : values.toAmount;

    if (isEqual(defaultValues, { ...values, fromAmount, toAmount })) {
      notifyWarning('Будь ласка, змініть інформацію, щоб надіслати зміни!');
      return;
    }

    const body: UpdateTransferReqBody = {
      fromAccountId: values.sendingAccount.value,
      toAccountId: values.receivingAccount.value,
      fromAccountAmount: values.fromAmount,
      toAccountAmount: sameCurrencies ? fromAmount : toAmount,
      date: values.date.toISOString(),
      description: values.description,
    };

    await handleUpdateTransnsfer(body);
    await dispatch(fetchAccounts());
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth keepMounted={false}>
      <DialogContent>
        <Box width="100%" display="flex" flexDirection="column" gap={3} pt={2}>
          <Controller
            name="transactionType"
            control={control}
            render={({ field }) => (
              <FormControl>
                <TransactionTypeToggleBtn
                  value={field.value}
                  onChange={field.onChange}
                  options={['TRANSFER']}
                />
              </FormControl>
            )}
          />
          <Typography
            variant="caption"
            color={watchSendingAccount.balance > 0 ? 'success.light' : 'error.light'}
          >
            Current balance: {`${watchSendingAccount.balance} ${watchSendingAccount.currency}`}
          </Typography>
          <Controller
            name="sendingAccount"
            control={control}
            rules={{
              required: true,
              validate: {
                notEqualToReceivingAccount: (value) =>
                  validateTransferAccounts(value, watchReceivingAccount),
              },
            }}
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
                  options={[...accountsOptions].filter(
                    (o) => o.value !== watchReceivingAccount.value,
                  )}
                  {...field}
                  disableClearable
                  isOptionEqualToValue={(o, v) => isEqual(o, v)}
                  onChange={(_e, nextValue) => field.onChange(nextValue)}
                  renderInput={(params) => (
                    <TextField
                      label="Рахунок для відправлення"
                      {...params}
                      size="small"
                      required
                      error={fieldState.invalid}
                      helperText={fieldState.error ? fieldState.error.message : undefined}
                    />
                  )}
                />
              </FormControl>
            )}
          />
          <Controller
            name="receivingAccount"
            control={control}
            rules={{
              required: true,
              validate: {
                notEqualToSendingAccount: (value) =>
                  validateTransferAccounts(value, watchSendingAccount),
              },
            }}
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
                  options={[...accountsOptions].filter(
                    (o) => o.value !== watchSendingAccount.value,
                  )}
                  {...field}
                  disableClearable
                  isOptionEqualToValue={(o, v) => isEqual(o, v)}
                  onChange={(_e, nextValue) => field.onChange(nextValue)}
                  renderInput={(params) => (
                    <TextField
                      label="Рахунок отримання"
                      {...params}
                      size="small"
                      required
                      error={fieldState.invalid}
                      helperText={fieldState.error ? fieldState.error.message : undefined}
                    />
                  )}
                />
              </FormControl>
            )}
          />
          <Controller
            name="fromAmount"
            control={control}
            rules={{
              required: true,
              validate: {
                moreThanZero: validateFormAmount,
                insufficientBalance: (value) =>
                  validateAbilityToWithdrawAmount(
                    value,
                    'TRANSFER',
                    accounts,
                    watchSendingAccount.value,
                  ),
              },
            }}
            render={({ field, fieldState }) => (
              <FormControl>
                <TextField
                  type="number"
                  size="small"
                  label="Cума з аккаунту"
                  {...field}
                  required
                  error={fieldState.invalid}
                  helperText={fieldState.error ? fieldState.error.message : undefined}
                  InputProps={{
                    startAdornment: (
                      <Box display="flex" mr={1} gap={1} alignItems="center">
                        <Typography>{watchSendingAccount.currency}</Typography>
                        <Divider orientation="vertical" sx={{ height: '20px' }} />
                      </Box>
                    ),
                  }}
                />
              </FormControl>
            )}
          />
          {watchReceivingAccount.currency !== watchSendingAccount.currency && (
            <Controller
              name="toAmount"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <FormControl>
                  <TextField
                    type="number"
                    size="small"
                    label="Сума на рахунок"
                    {...field}
                    required
                    InputProps={{
                      startAdornment: (
                        <Box display="flex" mr={1} gap={1} alignItems="center">
                          <Typography>{watchReceivingAccount.currency}</Typography>
                          <Divider orientation="vertical" sx={{ height: '20px' }} />
                        </Box>
                      ),
                    }}
                  />
                </FormControl>
              )}
            />
          )}

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Дата і час"
                  {...field}
                />
              </LocalizationProvider>
            )}
          />
          {isAllOptionsVisible && (
            <>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <TextField
                      multiline
                      type="text"
                      size="small"
                      rows={3}
                      label="Опис"
                      {...field}
                    />
                  </FormControl>
                )}
              />
            </>
          )}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" my={2}>
          <Button
            startIcon={isAllOptionsVisible ? <ExpandLessRounded /> : <ExpandMoreRounded />}
            onClick={() => setIsAllOptionsVisible((current) => !current)}
          >
            {isAllOptionsVisible ? 'Показати більше опцій' : 'Сховати'}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton loading={isLoading} onClick={onSubmit(handleSubmit)} color="success">
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
