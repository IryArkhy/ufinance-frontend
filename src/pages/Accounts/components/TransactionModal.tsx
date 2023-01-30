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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { capitalize, isEqual } from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Account } from '../types';

type FormData = {
  account: Account;
  amount: number;
  category: { id: string; name: string } | null;
  payee: { id: string; name: string } | null;
  transactionType: 'WITHDRAWAL' | 'DEPOSIT' | 'TRANSFER';
  tags: { id: string; name: string }[];
  receivingAccount: Account | null;
  description: string;
  date: Date;
};

type FormValues = {
  account: { label: string; value: string };
  amount: number;
  category: { label: string; value: string };
  payee: { label: string; value: string };
  transactionType: 'WITHDRAWAL' | 'DEPOSIT' | 'TRANSFER';
  tags: { label: string; value: string }[];
  receivingAccount: { label: string; value: string };
  description: string;
  date: Date;
};

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues: Pick<FormData, 'account'> | FormData;
  accounts: Account[];
}

export function TransactionModal({
  isOpen,
  onClose,
  defaultValues: propsValues,
  accounts,
}: TransactionModalProps) {
  const targetAccountOptions = accounts.map((a) => ({ value: a.id, label: a.name }));
  const receivingAccountOptions = [...targetAccountOptions];

  const categoryOptions = [
    { value: '1', label: 'Shopping' },
    { value: '2', label: 'Bills' },
    { value: '3', label: 'Groceries' },
    { value: '4', label: 'Pills' },
    { value: '5', label: 'Doctor' },
  ];
  const payeeOptions = [
    { value: '1', label: 'Aroma Kava' },
    { value: '2', label: 'Silpo' },
    { value: '3', label: 'Mega Market' },
    { value: '4', label: 'Apteka' },
    { value: '5', label: 'Yellow Cup Coffee' },
  ];
  const tagOptions = [
    { value: '1', label: 'coffee' },
    { value: '2', label: 'weekends' },
    { value: '3', label: 'date' },
    { value: '4', label: 'work' },
    { value: '5', label: 'spa' },
  ];

  const defaultValues: FormValues = {
    account: targetAccountOptions[0],
    amount: 0,
    category: { label: '', value: '' },
    payee: { label: '', value: '' },
    transactionType: 'WITHDRAWAL',
    tags: [],
    receivingAccount: { label: '', value: '' },
    description: '',
    date: new Date(),
  };

  const {
    control,
    handleSubmit: onSubmit,
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues,
  });

  const watchTransactionTypes = watch('transactionType');
  const watchAccountValue = watch('account.value');

  const handleSubmit = (values: FormValues) => undefined;

  function isFormData(values: typeof propsValues): values is FormData {
    if (Object.keys(values).length > 1) {
      return true;
    }

    return false;
  }

  React.useEffect(() => {
    if (propsValues) {
      if (isFormData(propsValues)) {
        const values: FormValues = {
          account: { label: propsValues.account.name, value: propsValues.account.id },
          amount: propsValues.amount,
          category: propsValues.category
            ? { label: propsValues.category.name, value: propsValues.category.id }
            : defaultValues.category,
          payee: propsValues.payee
            ? { label: propsValues.payee.name, value: propsValues.payee.id }
            : defaultValues.payee,
          transactionType: propsValues.transactionType,
          tags: propsValues.tags.map((tag) => ({ label: tag.name, value: tag.id })),
          receivingAccount: propsValues.receivingAccount
            ? { label: propsValues.receivingAccount.name, value: propsValues.receivingAccount.id }
            : defaultValues.receivingAccount,
          description: propsValues.description,
          date: propsValues.date,
        };

        reset(values);
      } else {
        reset({
          ...defaultValues,
          account: { label: propsValues.account.name, value: propsValues.account.id },
        });
      }
    }
  }, [propsValues]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{isFormData(propsValues) ? 'Update' : 'Add'} transaction</DialogTitle>

      <DialogContent>
        <Box width="100%" display="flex" flexDirection="column" gap={3} pt={2}>
          <Controller
            name="transactionType"
            control={control}
            render={({ field }) => (
              <FormControl>
                <Autocomplete
                  options={['WITHDRAWAL', 'DEPOSIT', 'TRANSFER']}
                  {...field}
                  isOptionEqualToValue={(o, v) => isEqual(o, v)}
                  onChange={(_e, nextValue) => field.onChange(nextValue)}
                  getOptionLabel={(o) => capitalize(o.toLowerCase())}
                  renderInput={(params) => (
                    <TextField label="Transaction type" {...params} size="small" required />
                  )}
                />
              </FormControl>
            )}
          />
          <Controller
            name="account"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormControl>
                <Autocomplete
                  options={targetAccountOptions}
                  {...field}
                  isOptionEqualToValue={(o, v) => isEqual(o, v)}
                  onChange={(_e, nextValue) => field.onChange(nextValue)}
                  renderInput={(params) => (
                    <TextField label="Target Account" {...params} size="small" required />
                  )}
                />
              </FormControl>
            )}
          />

          {watchTransactionTypes === 'TRANSFER' && (
            <Controller
              name="receivingAccount"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <FormControl>
                  <Autocomplete
                    options={receivingAccountOptions}
                    {...field}
                    isOptionEqualToValue={(o, v) => isEqual(o, v)}
                    onChange={(_e, nextValue) => field.onChange(nextValue)}
                    renderInput={(params) => (
                      <TextField label="Receiving Account" {...params} size="small" required />
                    )}
                  />
                </FormControl>
              )}
            />
          )}

          <Controller
            name="amount"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormControl>
                <TextField
                  type="number"
                  size="small"
                  label="Amount"
                  {...field}
                  required
                  InputProps={{
                    startAdornment: (
                      <Box display="flex" mr={1} gap={1} alignItems="center">
                        <Typography>
                          {accounts.find(({ id }) => id === watchAccountValue)!.currency}
                        </Typography>
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
                <DatePicker
                  label="Basic example"
                  {...field}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            )}
          />

          {watchTransactionTypes !== 'TRANSFER' && (
            // Async Autocomplete
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
              {/* Async Autocomplete */}
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
            </>
          )}

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
          {watchTransactionTypes !== 'TRANSFER' && (
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <Autocomplete
                    multiple
                    options={tagOptions}
                    freeSolo
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
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton onClick={onSubmit(handleSubmit)} color="success">
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
