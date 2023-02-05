import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { isEqual } from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Account } from '../../../../lib/api/accounts';
import {
  Transaction,
  TransactionType,
  UpdateTransactionReqBody,
} from '../../../../lib/api/transactions';
import { ErrorData } from '../../../../lib/api/utils';
import { NotificationContext } from '../../../../lib/notifications';
import { editTransaction, fetchAccounts } from '../../../../redux/accounts/thunks';
import { fetchBalance } from '../../../../redux/balance/thunks';
import { getCategories } from '../../../../redux/categories/selectors';
import { useDispatch, useSelector } from '../../../../redux/hooks';
import { getPayees } from '../../../../redux/payees/selectors';
import { getTags } from '../../../../redux/tags/selectors';
import { TransactionTypeToggleBtn } from '../TransactionTypeToggleBtn';

import { TransactionFormValues } from './types';
import {
  getAccountOption,
  getDefaultTransactionFormValues,
  getOption,
  validateAbilityToWithdrawAmount,
  validateFormAmount,
} from './utils';

export type FormTransactionType = Omit<Transaction, 'type'> & {
  type: Exclude<TransactionType, 'TRANSFER'>;
};

export type UpdateTransactionModalProps = {
  transaction: Omit<Transaction, 'type'> & { type: Exclude<TransactionType, 'TRANSFER'> };
  accounts: Account[];
  isOpen: boolean;
  onClose: () => void;
};

export function UpdateTransactionModal({
  transaction,
  accounts,
  isOpen,
  onClose,
}: UpdateTransactionModalProps) {
  const { categories } = useSelector(getCategories);
  const { payees } = useSelector(getPayees);
  const { tags } = useSelector(getTags);
  const dispatch = useDispatch();
  const { notifyError, notifySuccess, notifyWarning } = React.useContext(NotificationContext);
  const [isAllOptionsVisible, setIsAllOptionsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const categoryOptions = categories.map(getOption);
  const payeeOptions = payees.map(getOption);
  const tagsOptions = tags.map(getOption);
  const accountsOptions = accounts.map(getAccountOption);

  const defaultValues = getDefaultTransactionFormValues(accountsOptions, transaction);

  const {
    control,
    handleSubmit: onSubmit,
    watch,
  } = useForm<TransactionFormValues>({
    defaultValues,
  });

  const watchAccount = watch('account');
  const watchType = watch('transactionType');

  const handleUpdateTransaction = async (values: UpdateTransactionReqBody) => {
    setIsLoading(true);
    const resultAction = await dispatch(editTransaction({ data: values, id: transaction.id }));

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
      setIsLoading(false);
    } else {
      await dispatch(fetchBalance());
      notifySuccess('Updated');
      setIsLoading(false);
      onClose();
    }
  };

  const handleSubmit = async (values: TransactionFormValues) => {
    const amount = typeof values.amount === 'string' ? parseFloat(values.amount) : values.amount;

    if (isEqual(defaultValues, { ...values, amount })) {
      notifyWarning('Please update values to submit changes!');
      return;
    }

    const body: UpdateTransactionReqBody = {
      fromAccountId: values.account.value,
      amount,
      date: values.date.toISOString(),
      transactionType: values.transactionType,
      categoryId: values.category.value || undefined,
      payeeId: values.payee.value || undefined,
      description: values.description || undefined,
      tagNames: values.tags.map((t) => t.label),
    };

    await handleUpdateTransaction(body);
    await dispatch(fetchAccounts());
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth keepMounted={false}>
      <DialogTitle>Update transaction</DialogTitle>
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
                  options={['WITHDRAWAL', 'DEPOSIT']}
                />
              </FormControl>
            )}
          />
          <Typography
            variant="caption"
            color={watchAccount.balance > 0 ? 'success.light' : 'error.light'}
          >
            Current balance: {`${watchAccount.balance} ${watchAccount.currency}`}
          </Typography>
          <Controller
            name="account"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormControl>
                <Autocomplete
                  options={accountsOptions}
                  {...field}
                  isOptionEqualToValue={(o, v) => isEqual(o, v)}
                  onChange={(_e, nextValue) => field.onChange(nextValue)}
                  disableClearable
                  renderInput={(params) => (
                    <TextField label="Target Account" {...params} size="small" required />
                  )}
                />
              </FormControl>
            )}
          />
          <Controller
            name="amount"
            control={control}
            rules={{
              required: true,
              validate: {
                moreThanZero: validateFormAmount,
                insufficientBalance: (value) =>
                  validateAbilityToWithdrawAmount(value, watchType, accounts, watchAccount.value),
              },
            }}
            render={({ field, fieldState }) => (
              <FormControl>
                <TextField
                  type="number"
                  size="small"
                  label="Amount"
                  {...field}
                  required
                  error={fieldState.invalid}
                  helperText={fieldState.error ? fieldState.error.message : undefined}
                  InputProps={{
                    startAdornment: (
                      <Box display="flex" mr={1} gap={1} alignItems="center">
                        <Typography>{watchAccount.currency}</Typography>
                        <Divider orientation="vertical" sx={{ height: '20px' }} />
                      </Box>
                    ),
                  }}
                />
              </FormControl>
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Date Time"
                  disableFuture
                  {...field}
                />
              </LocalizationProvider>
            )}
          />

          {isAllOptionsVisible && (
            <>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <Autocomplete
                      options={categoryOptions}
                      {...field}
                      freeSolo
                      isOptionEqualToValue={(o, v) => isEqual(o, v)}
                      onChange={(_e, nextValue) => field.onChange(nextValue)}
                      renderInput={(params) => (
                        <TextField label="Category" {...params} size="small" />
                      )}
                    />
                  </FormControl>
                )}
              />
              <Controller
                name="payee"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <Autocomplete
                      options={payeeOptions}
                      {...field}
                      freeSolo
                      isOptionEqualToValue={(o, v) => isEqual(o, v)}
                      onChange={(_e, nextValue) => field.onChange(nextValue)}
                      renderInput={(params) => <TextField label="Payee" {...params} size="small" />}
                    />
                  </FormControl>
                )}
              />

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
                      label="Description"
                      {...field}
                    />
                  </FormControl>
                )}
              />

              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <Autocomplete
                      multiple
                      options={tagsOptions}
                      {...field}
                      onChange={(_e, nextValue) => field.onChange(nextValue)}
                      isOptionEqualToValue={(o, v) => isEqual(o, v)}
                      renderTags={(value: { label: string; value: string }[], getTagProps) =>
                        value.map((option, index: number) => (
                          <Chip
                            variant="outlined"
                            label={option.label}
                            {...getTagProps({ index })}
                            key={option.value}
                          />
                        ))
                      }
                      renderInput={(params) => <TextField {...params} label="Tags" />}
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
            {isAllOptionsVisible ? 'Show less' : 'Show more'}
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
