import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { isEqual } from 'lodash';
import { Controller, UseFormReturn } from 'react-hook-form';

import { Transaction, TransactionType } from '../../../../lib/api/transactions';
import { getAccounts } from '../../../../redux/accounts/selectors';
import { getCategories } from '../../../../redux/categories/selectors';
import { useSelector } from '../../../../redux/hooks';
import { getPayees } from '../../../../redux/payees/selectors';
import { getTags } from '../../../../redux/tags/selectors';

import { TransactionFormValues } from './types';
import { getAccountOption, getOption } from './utils';

export type FormTransactionType = Omit<Transaction, 'type'> & {
  type: Exclude<TransactionType, 'TRANSFER'>;
};

export type TransactionFormProps = {
  formData: UseFormReturn<TransactionFormValues, any>;
  isAllOptionsVisible: boolean;
};

export function TransactionForm({ formData, isAllOptionsVisible }: TransactionFormProps) {
  const { categories } = useSelector(getCategories);
  const { payees } = useSelector(getPayees);
  const { tags } = useSelector(getTags);
  const accounts = useSelector(getAccounts);

  const categoryOptions = categories.map(getOption);
  const payeeOptions = payees.map(getOption);
  const tagsOptions = tags.map(getOption);
  const accountsOptions = accounts.data.map(getAccountOption);

  const { control, watch } = formData;

  const watchAccount = watch('account');

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={3} pt={2}>
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
              getOptionLabel={(o) => o.label}
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
                  renderInput={(params) => <TextField label="Category" {...params} size="small" />}
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
  );
}
