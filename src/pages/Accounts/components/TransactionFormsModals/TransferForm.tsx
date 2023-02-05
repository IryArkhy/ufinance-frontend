import { Autocomplete, Box, Divider, FormControl, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { isEqual } from 'lodash';
import { Controller, UseFormReturn } from 'react-hook-form';

import { Account } from '../../../../lib/api/accounts';
import { Transaction, TransactionType } from '../../../../lib/api/transactions';

import { TransferFormValues } from './types';
import {
  getAccountOption,
  validateAbilityToWithdrawAmount,
  validateFormAmount,
  validateTransferAccounts,
} from './utils';

export type FormTransferType = Omit<Transaction, 'type'> & {
  type: Extract<TransactionType, 'TRANSFER'>;
};

export type TransferFormProps = {
  formData: UseFormReturn<TransferFormValues, any>;
  accounts: Account[];
  isAllOptionsVisible: boolean;
};

export function TransferForm({ formData, accounts, isAllOptionsVisible }: TransferFormProps) {
  const accountsOptions = accounts.map(getAccountOption);

  const { control, watch } = formData;

  const watchSendingAccount = watch('sendingAccount');
  const watchReceivingAccount = watch('receivingAccount');

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={3} pt={2}>
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
              options={[...accountsOptions].filter((o) => o.value !== watchReceivingAccount.value)}
              {...field}
              disableClearable
              isOptionEqualToValue={(o, v) => isEqual(o, v)}
              onChange={(_e, nextValue) => field.onChange(nextValue)}
              renderInput={(params) => (
                <TextField
                  label="Sending Account"
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
              options={[...accountsOptions].filter((o) => o.value !== watchSendingAccount.value)}
              {...field}
              disableClearable
              isOptionEqualToValue={(o, v) => isEqual(o, v)}
              onChange={(_e, nextValue) => field.onChange(nextValue)}
              renderInput={(params) => (
                <TextField
                  label="Receiving Account"
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
              label="From account"
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
                label="To account"
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="Date Time"
              {...field}
            />
          </LocalizationProvider>
        )}
      />
      {isAllOptionsVisible && (
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
      )}
    </Box>
  );
}
