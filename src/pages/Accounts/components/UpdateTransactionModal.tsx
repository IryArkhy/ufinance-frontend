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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { capitalize, isEqual } from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Account } from '../../../lib/api/accounts';
import { Transaction } from '../../../lib/api/transactions';
import { getCategories } from '../../../redux/categories/selectors';
import { useSelector } from '../../../redux/hooks';
import { getPayees } from '../../../redux/payees/selectors';
import { getTags } from '../../../redux/tags/selectors';

import { TransactionTypeToggleBtn } from './TransactionTypeToggleBtn';

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

interface UpdateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  accounts: Account[];
}

export function UpdateTransactionModal({
  isOpen,
  onClose,
  transaction,
  accounts,
}: UpdateTransactionModalProps) {
  const { categories } = useSelector(getCategories);
  const { payees } = useSelector(getPayees);
  const { tags } = useSelector(getTags);
  const [isAllOptionsVisible, setIsAllOptionsVisible] = React.useState(false);

  const {
    fromAccountId,
    amount,
    category,
    payee,
    tags: transactionTags,
    type,
    toAccountId,
    date,
    description,
  } = transaction;

  const targetAccountOptions = accounts.map((a) => ({ value: a.id, label: a.name }));
  const receivingAccountOptions = [...targetAccountOptions];

  const categoryOptions = categories.map((c) => ({ label: c.name, value: c.id }));
  const payeeOptions = payees.map((p) => ({ label: p.name, value: p.id }));
  const tagOptions = tags.map((t) => ({ label: t.name, value: t.id }));

  const defaultOption = { label: '', value: '' };

  const defaultValues = {
    account: targetAccountOptions.find((a) => a.value === fromAccountId),
    amount: amount,
    category: category ? { value: category.id, label: category.name } : defaultOption,
    payee: payee ? { value: payee.id, label: payee.name } : defaultOption,
    transactionType: type,
    tags: transactionTags.map((tag) => ({ label: tag.tag.name, value: tag.id })),
    receivingAccount: receivingAccountOptions.find((a) => a.value === toAccountId) ?? defaultOption,
    description: description ?? '',
    date: new Date(date),
  };

  const {
    control,
    handleSubmit: onSubmit,
    watch,
  } = useForm<FormValues>({
    defaultValues,
  });

  const watchTransactionTypes = watch('transactionType');
  const watchAccountValue = watch('account.value');

  const handleSubmit = (values: FormValues) => undefined;

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
                <TransactionTypeToggleBtn value={field.value} onChange={field.onChange} />
                {/* <Autocomplete
                  options={['WITHDRAWAL', 'DEPOSIT', 'TRANSFER']}
                  {...field}
                  isOptionEqualToValue={(o, v) => isEqual(o, v)}
                  onChange={(_e, nextValue) => field.onChange(nextValue)}
                  getOptionLabel={(o) => capitalize(o.toLowerCase())}
                  renderInput={(params) => (
                    <TextField label="Transaction type" {...params} size="small" required />
                  )}
                /> */}
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

          {isAllOptionsVisible && (
            <>
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
                          renderInput={(params) => (
                            <TextField label="Payee" {...params} size="small" />
                          )}
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
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton onClick={onSubmit(handleSubmit)} color="success">
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
