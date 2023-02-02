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
  updateTransaction,
} from '../../../../lib/api/transactions';
import { getCategories } from '../../../../redux/categories/selectors';
import { useSelector } from '../../../../redux/hooks';
import { getPayees } from '../../../../redux/payees/selectors';
import { getTags } from '../../../../redux/tags/selectors';
import { TransactionTypeToggleBtn } from '../TransactionTypeToggleBtn';

import { TransactionFormValues } from './types';
import { getAccountOption, getDefaultTransactionFormValues, getOption } from './utils';

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
  const [isAllOptionsVisible, setIsAllOptionsVisible] = React.useState(false);

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

  const handleSubmit = async (values: TransactionFormValues) => {
    const body: UpdateTransactionReqBody = {
      fromAccountId: values.account.value,
      amount: values.amount,
      date: values.date.toISOString(),
      transactionType: values.transactionType,
      categoryId: values.category.value ?? undefined,
      payeeId: values.payee.value ?? undefined,
      description: values.description ?? undefined,
      tagNames: values.tags.map((t) => t.label),
    };

    await updateTransaction(body, transaction.id);
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
                  options={['DEPOSIT', 'WITHDRAWAL']}
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
                  options={accountsOptions}
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
                  label="Date Time "
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
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton onClick={onSubmit(handleSubmit)} color="success">
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}