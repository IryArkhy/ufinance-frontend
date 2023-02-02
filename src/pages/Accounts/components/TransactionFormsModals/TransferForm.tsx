import { Autocomplete, Box, Divider, FormControl, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { isEqual } from 'lodash';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

import { Account } from '../../../../lib/api/accounts';
import { Transaction, TransactionType } from '../../../../lib/api/transactions';

import { TransferFormValues } from './types';
import { getAccountOption, getOption } from './utils';

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
      <Controller
        name="sendingAccount"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <FormControl>
            <Autocomplete
              options={[...accountsOptions].filter((o) => o.value !== watchReceivingAccount.value)}
              {...field}
              isOptionEqualToValue={(o, v) => isEqual(o, v)}
              onChange={(_e, nextValue) => field.onChange(nextValue)}
              renderInput={(params) => (
                <TextField label="Sending Account" {...params} size="small" required />
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
        }}
        render={({ field }) => (
          <FormControl>
            <Autocomplete
              options={[...accountsOptions].filter((o) => o.value !== watchSendingAccount.value)}
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
      <Controller
        name="fromAmount"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <FormControl>
            <TextField
              type="number"
              size="small"
              label="From account"
              {...field}
              required
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
